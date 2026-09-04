import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { EMAIL_QUEUE_NAME } from "../queues/email.queue.js";
import { getEmailTransporter } from "../config/email.js";
import prisma from "../config/database.js";
import nodemailer from "nodemailer";

const emailWorker = new Worker(
  EMAIL_QUEUE_NAME,
  async (job) => {
    const {
      emailId,
      senderEmail,
      recipient,
      subject,
      body,
    } = job.data;

    console.log("=================================");
    console.log(`Processing email job: ${job.id}`);
    console.log(`Email ID: ${emailId}`);
    console.log(`Sending to: ${recipient}`);
    console.log("=================================");

    // Mark email as processing
    await prisma.email.update({
      where: {
        id: emailId,
      },
      data: {
        status: "PROCESSING",
      },
    });

    try {
      const transporter = await getEmailTransporter();

      const info = await transporter.sendMail({
        from: `"ReachInbox" <${senderEmail}>`,
        to: recipient,
        subject,
        text: body,
        html: `<p>${body}</p>`,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info);

      // Mark email as sent
      await prisma.email.update({
        where: {
          id: emailId,
        },
        data: {
          status: "SENT",
          sentAt: new Date(),
          messageId: info.messageId,
        },
      });

      console.log("Email sent successfully!");
      console.log("Message ID:", info.messageId);

      if (previewUrl) {
        console.log("Ethereal Preview URL:", previewUrl);
      }

      return {
        success: true,
        messageId: info.messageId,
        previewUrl,
      };
    } catch (error) {
      // Mark email as failed
      await prisma.email.update({
        where: {
          id: emailId,
        },
        data: {
          status: "FAILED",
        },
      });

      throw error;
    }
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
  console.error(
    `BullMQ job ${job?.id ?? "unknown"} failed:`,
    error.message
  );
});

emailWorker.on("error", (error) => {
  console.error("BullMQ worker error:", error);
});

console.log("Email worker started");