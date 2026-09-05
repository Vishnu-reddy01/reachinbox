import "dotenv/config";

import app from "./app.js";
import redis from "./config/redis.js";
import prisma from "./config/database.js";

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    await redis.ping();
    console.log("Redis connected successfully");

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