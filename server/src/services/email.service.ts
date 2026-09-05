import { emailQueue } from "../queues/email.queue.js";
import prisma from "../config/database.js";
import { indexEmail } from "./elasticsearch.service.js";

interface ScheduleEmailInput {
  senderEmail: string;
  senderName?: string;
  recipient: string;
  subject: string;
  body: string;
  scheduledAt: string;
}

export async function scheduleEmail(input: ScheduleEmailInput) {
  const scheduledDate = new Date(input.scheduledAt);

  if (Number.isNaN(scheduledDate.getTime())) {
    throw new Error("Invalid scheduledAt date");
  }

  if (scheduledDate.getTime() <= Date.now()) {
    throw new Error("scheduledAt must be a future date");
  }

  // Create or find a user for the sender.
  const user = await prisma.user.upsert({
    where: {
      email: input.senderEmail,
    },
    update: {
      name: input.senderName,
    },
    create: {
      email: input.senderEmail,
      name: input.senderName,
    },
  });

  // Create or find the sender.
  const sender = await prisma.sender.upsert({
    where: {
      email: input.senderEmail,
    },
    update: {
      name: input.senderName,
      userId: user.id,
    },
    create: {
      email: input.senderEmail,
      name: input.senderName,
      userId: user.id,
    },
  });

  // Save email in PostgreSQL first.
  const email = await prisma.email.create({
    data: {
      senderId: sender.id,
      recipient: input.recipient,
      subject: input.subject,
      body: input.body,
      scheduledAt: scheduledDate,
      status: "SCHEDULED",
    },
  });

  // Search indexing must never prevent scheduling. PostgreSQL + BullMQ are the source of truth.
  try {
    await indexEmail({
      id: email.id,
      senderEmail: input.senderEmail,
      recipient: email.recipient,
      subject: email.subject,
      body: email.body,
      status: email.status,
      scheduledAt: email.scheduledAt,
      sentAt: email.sentAt,
      createdAt: email.createdAt,
    });
    console.log("Email indexed in Elasticsearch:", email.id);
  } catch (error) {
    console.warn(
      "Elasticsearch indexing failed; email will still be scheduled:",
      error instanceof Error ? error.message : error
    );
  }

  const delay = scheduledDate.getTime() - Date.now();

  try {
    const job = await emailQueue.add(
      "send-email",
      {
        emailId: email.id,
        senderEmail: input.senderEmail,
        recipient: input.recipient,
        subject: input.subject,
        body: input.body,
      },
      {
        delay,
        jobId: email.id,
      }
    );

    // Store BullMQ job ID in PostgreSQL.
    const updatedEmail = await prisma.email.update({
      where: {
        id: email.id,
      },
      data: {
        bullJobId: job.id,
      },
    });

    return {
      email: updatedEmail,
      jobId: job.id,
    };
  } catch (error) {
    // If Redis/BullMQ fails, don't leave a misleading scheduled record.
    await prisma.email.delete({
      where: {
        id: email.id,
      },
    });

    throw error;
  }
}