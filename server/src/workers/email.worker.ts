import { Worker } from "bullmq";
import nodemailer from "nodemailer";
import redis from "../config/redis.js";
import { EMAIL_QUEUE_NAME } from "../queues/email.queue.js";
import { getEmailTransporter } from "../config/email.js";
import prisma from "../config/database.js";
import { updateEmailIndex } from "../services/elasticsearch.service.js";

async function safeIndexUpdate(id: string, data: Record<string, unknown>) {
  try {
    await updateEmailIndex(id, data);
  } catch (error) {
    console.warn(
      `Elasticsearch update failed for ${id}:`,
      error instanceof Error ? error.message : error
    );
  }
}

const emailWorker = new Worker(
  EMAIL_QUEUE_NAME,
  async (job) => {
    const { emailId, senderEmail, recipient, subject, body } = job.data;

    console.log("=================================");
    console.log(`Processing email job: ${job.id}`);
    console.log(`Email ID: ${emailId}`);
    console.log(`Sending to: ${recipient}`);
    console.log("=================================");

    // Idempotency guard: a retry must never send an already-sent email again.
    const current = await prisma.email.findUnique({ where: { id: emailId } });
    if (!current) {
      console.warn(`Email ${emailId} no longer exists; skipping job.`);
      return { success: true, skipped: true };
    }
    if (current.status === "SENT") {
      console.log(`Email ${emailId} is already SENT; skipping duplicate job.`);
      return { success: true, skipped: true, messageId: current.messageId };
    }
    if (current.status === "CANCELLED") {
      console.log(`Email ${emailId} is CANCELLED; skipping job.`);
      return { success: true, skipped: true };
    }

    await prisma.email.update({
      where: { id: emailId },
      data: { status: "PROCESSING" },
    });
    await safeIndexUpdate(emailId, { status: "PROCESSING" });

    let info: nodemailer.SentMessageInfo;

    try {
      const transporter = await getEmailTransporter();
      info = await transporter.sendMail({
        from: `"ReachInbox" <${senderEmail}>`,
        to: recipient,
        subject,
        text: body,
        html: `<p>${body}</p>`,
      });

      if (Array.isArray(info.rejected) && info.rejected.length > 0) {
        throw new Error(`SMTP rejected recipient: ${info.rejected.join(", ")}`);
      }
    } catch (error) {
      console.error(
        `Email sending failed for ${emailId}:`,
        error instanceof Error ? error.message : error
      );

      await prisma.email.update({
        where: { id: emailId },
        data: { status: "FAILED" },
      });
      await safeIndexUpdate(emailId, { status: "FAILED" });
      throw error; // BullMQ retry policy handles transient SMTP failures.
    }

    const sentAt = new Date();

    // The SMTP server accepted the message. Persist SENT before completing the job.
    // If the first DB write fails, retry locally instead of re-running sendMail().
    let lastDbError: unknown;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await prisma.email.update({
          where: { id: emailId },
          data: {
            status: "SENT",
            sentAt,
            messageId: info.messageId,
          },
        });
        lastDbError = undefined;
        break;
      } catch (error) {
        lastDbError = error;
        console.error(`SENT database update attempt ${attempt}/3 failed for ${emailId}`);
        if (attempt < 3) {
          await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
        }
      }
    }

    if (lastDbError) {
      // Do not throw here: the email was already accepted by SMTP and throwing
      // would allow BullMQ to retry the send and create a duplicate email.
      console.error(
        `CRITICAL: email ${emailId} was accepted by SMTP but SENT status could not be persisted:`,
        lastDbError
      );
      return {
        success: true,
        deliveryAccepted: true,
        persistenceWarning: true,
        messageId: info.messageId,
      };
    }

    await safeIndexUpdate(emailId, { status: "SENT", sentAt });

    console.log("Email sent successfully!");
    console.log("Message ID:", info.messageId);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log("Ethereal preview URL:", previewUrl);

    return { success: true, messageId: info.messageId };
  },
  {
    connection: redis,
    concurrency: Number(process.env.WORKER_CONCURRENCY || 5),
  }
);

emailWorker.on("completed", (job) => {
  console.log(`BullMQ job ${job.id} completed`);
});

emailWorker.on("failed", (job, error) => {
  console.error(`BullMQ job ${job?.id ?? "unknown"} failed:`, error.message);
});

emailWorker.on("error", (error) => {
  console.error("BullMQ worker error:", error);
});

console.log("Email worker started");
