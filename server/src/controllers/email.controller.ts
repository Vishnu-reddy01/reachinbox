import { Request, Response } from "express";
import { scheduleEmail } from "../services/email.service.js";
import prisma from "../config/database.js";
import { emailQueue } from "../queues/email.queue.js";

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

    const emails = await prisma.email.findMany({
      where: {
  status: {
    in: ["SENT", "FAILED"],
  },
  sender: {
    email: senderEmail,
  },
},
      include: {
        sender: true,
      },
      orderBy: {
        sentAt: "desc",
      },
    });

    return res.json({
      success: true,
      count: emails.length,
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

    if (email.status !== "SCHEDULED") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel email with status ${email.status}`,
      });
    }

    // Remove the delayed BullMQ job
    if (email.bullJobId) {
      const job = await emailQueue.getJob(email.bullJobId);

      if (job) {
        await job.remove();
      }
    }

    // Update PostgreSQL
    const updatedEmail = await prisma.email.update({
      where: {
        id,
      },
      data: {
        status: "CANCELLED",
      },
    });

    return res.json({
      success: true,
      message: "Email cancelled successfully",
      emailId: updatedEmail.id,
      status: updatedEmail.status,
    });
  } catch (error) {
    console.error("Cancel email error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to cancel email",
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