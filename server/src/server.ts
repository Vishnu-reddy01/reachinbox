import "dotenv/config";

import app from "./app.js";
import redis from "./config/redis.js";
import prisma from "./config/database.js";
import { createEmailIndex, indexEmail } from "./services/elasticsearch.service.js";

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    await redis.ping();
    console.log("Redis connected successfully");

    try {
      await createEmailIndex();

      // Backfill PostgreSQL records so emails created before Elasticsearch
      // was enabled are searchable too.
      const existingEmails = await prisma.email.findMany({ include: { sender: true } });
      for (const email of existingEmails) {
        await indexEmail({
          id: email.id,
          senderEmail: email.sender.email,
          recipient: email.recipient,
          subject: email.subject,
          body: email.body,
          status: email.status,
          scheduledAt: email.scheduledAt,
          sentAt: email.sentAt,
          createdAt: email.createdAt,
        });
      }
      console.log(`Elasticsearch connected; ${existingEmails.length} email(s) synchronized`);
    } catch (error) {
      console.warn(
        "Elasticsearch unavailable. API will continue running, but search will be unavailable until Elasticsearch is reachable:",
        error instanceof Error ? error.message : error
      );
    }

    // Start BullMQ worker in the same Render service
    await import("./workers/email.worker.js");
    console.log("Email worker loaded successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();