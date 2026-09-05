import { Request, Response } from "express";
import { scheduleEmail } from "../services/email.service.js";
import prisma from "../config/database.js";
import { emailQueue } from "../queues/email.queue.js";
import { searchEmails, updateEmailIndex, deleteEmailIndex } from "../services/elasticsearch.service.js";

export async function scheduleEmailController(
  req: Request,
  res: Response
) {
  try {
    const {
      senderEmail,
      senderName,
      recipient,
      subject,
      body,
      scheduledAt,
    } = req.body;

    if (
      !senderEmail ||
      !recipient ||
      !subject ||
      !body ||
      !scheduledAt
    ) {
      return res.status(400).json({
        success: false,
        message:
          "senderEmail, recipient, subject, body and scheduledAt are required",
      });
    }

    const result = await scheduleEmail({
      senderEmail,
      senderName,
      recipient,
      subject,
      body,
      scheduledAt,
    });

    return res.status(201).json({
      success: true,
      message: "Email scheduled successfully",
      emailId: result.email.id,
      jobId: result.jobId,
      scheduledAt: result.email.scheduledAt,
      status: result.email.status,
    });
  } catch (error) {
    console.error("Schedule email error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Failed to schedule email";

    return res.status(500).json({
      success: false,
      message,
    });
  }
}
export async function getScheduledEmails(
  req: Request,
  res: Response
) {
  try {
    const senderEmail = String(req.query.senderEmail || "");

    if (!senderEmail) {
      return res.status(400).json({
        success: false,
        message: "senderEmail is required",
      });
    }

    const emails = await prisma.email.findMany({
      where: {
        status: "SCHEDULED",
        sender: {
          email: senderEmail,
        },
      },
      include: {
        sender: true,
      },
      orderBy: {
        scheduledAt: "asc",
      },
    });

    return res.json({
      success: true,
      count: emails.length,
      emails,
    });
  } catch (error) {
    console.error("Get scheduled emails error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch scheduled emails",
    });
  }
}

export async function getSentEmails(
  req: Request,
  res: Response
) {
  try {
    const senderEmail = req.query.senderEmail as string;

    if (!senderEmail) {
      return res.status(400).json({
        success: false,
        message: "senderEmail is required",
      });
    }

    // Fetch SENT and FAILED separately so null sentAt values from failed
    // records do not hide successfully sent messages at the top of the list.
    const [sent, failed] = await Promise.all([
      prisma.email.findMany({
        where: { status: "SENT", sender: { email: senderEmail } },
        include: { sender: true },
        orderBy: { sentAt: "desc" },
      }),
      prisma.email.findMany({
        where: { status: "FAILED", sender: { email: senderEmail } },
        include: { sender: true },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const emails = [...sent, ...failed];

    return res.json({
      success: true,
      count: emails.length,
      sentCount: sent.length,
      failedCount: failed.length,
      emails,
    });
  } catch (error) {
    console.error("Get sent emails error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sent emails",
    });
  }
}


export const cancelEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Email ID is required",
      });
    }

    const email = await prisma.email.findUnique({
      where: { id },
    });

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email not found",
      });
    }

    // Scheduled email → cancel it and remove BullMQ job
    if (email.status === "SCHEDULED") {
      if (email.bullJobId) {
        const job = await emailQueue.getJob(email.bullJobId);

        if (job) {
          await job.remove();
        }
      }

      const updatedEmail = await prisma.email.update({
        where: { id },
        data: { status: "CANCELLED" },
      });

      try {
        await updateEmailIndex(id, { status: "CANCELLED" });
      } catch (error) {
        console.warn("Failed to update cancelled email in Elasticsearch:", error);
      }

      return res.json({
        success: true,
        message: "Email cancelled successfully",
        emailId: updatedEmail.id,
        status: updatedEmail.status,
      });
    }

    // Sent or failed email → permanently delete it
    if (email.status === "SENT" || email.status === "FAILED") {
      await prisma.email.delete({ where: { id } });

      try {
        await deleteEmailIndex(id);
      } catch (error) {
        console.warn("Failed to delete email from Elasticsearch:", error);
      }

      return res.json({
        success: true,
        message: "Email deleted successfully",
        emailId: id,
      });
    }

    return res.status(400).json({
      success: false,
      message: `Cannot modify email with status ${email.status}`,
    });
  } catch (error) {
    console.error("Email action error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to modify email",
    });
  }
};

export async function scheduleBulkEmailsController(
  req: Request,
  res: Response
) {
  try {
    const {
      senderEmail,
      senderName,
      recipients,
      subject,
      body,
      startTime,
      delay,
      hourlyLimit,
    } = req.body;

    if (
      !senderEmail ||
      !Array.isArray(recipients) ||
      recipients.length === 0 ||
      !subject ||
      !body ||
      !startTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          "senderEmail, recipients, subject, body and startTime are required",
      });
    }

    const delaySeconds = Number(delay) || 10;
    const limit = Number(hourlyLimit) || 50;

    if (delaySeconds < 1) {
      return res.status(400).json({
        success: false,
        message: "Delay must be at least 1 second",
      });
    }

    if (limit < 1) {
      return res.status(400).json({
        success: false,
        message: "Hourly limit must be at least 1",
      });
    }

    const start = new Date(startTime);

    if (Number.isNaN(start.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid startTime",
      });
    }

    if (start.getTime() <= Date.now()) {
      return res.status(400).json({
        success: false,
        message: "startTime must be in the future",
      });
    }

    const results = [];

    for (let i = 0; i < recipients.length; i++) {
      /*
       * Calculate the hour bucket.
       *
       * Example:
       * hourlyLimit = 50
       *
       * Emails 0-49  -> first hour
       * Emails 50-99 -> second hour
       */
      const hourOffset = Math.floor(i / limit);

      /*
       * Within each hour, apply the configured delay.
       */
      const positionInHour = i % limit;

      const scheduledAt = new Date(
        start.getTime() +
          hourOffset * 60 * 60 * 1000 +
          positionInHour * delaySeconds * 1000
      );

      const result = await scheduleEmail({
        senderEmail,
        senderName,
        recipient: recipients[i],
        subject,
        body,
        scheduledAt: scheduledAt.toISOString(),
      });

      results.push({
        emailId: result.email.id,
        jobId: result.jobId,
        recipient: recipients[i],
        scheduledAt: result.email.scheduledAt,
      });
    }

    return res.status(201).json({
      success: true,
      message: `${results.length} emails scheduled successfully`,
      count: results.length,
      emails: results,
    });
  } catch (error) {
    console.error("Bulk schedule error:", error);

    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to schedule emails",
    });
  }
}

export async function searchEmailsController(
  req: Request,
  res: Response
) {
  try {
    const query = String(req.query.q || "");
    const senderEmail = req.query.senderEmail
      ? String(req.query.senderEmail)
      : undefined;

    if (!query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const emails = await searchEmails(query, senderEmail);

    return res.json({
      success: true,
      count: emails.length,
      emails,
    });
  } catch (error) {
    console.error("Search emails error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search emails",
    });
  }
}