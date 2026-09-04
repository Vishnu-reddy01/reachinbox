import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import redis from "./config/redis.js";
import prisma from "./config/database.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();

    console.log("Database connected successfully");

    await redis.ping();

    console.log("Redis connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();