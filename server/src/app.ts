import express from "express";
import cors from "cors";
import { emailQueue } from "./queues/email.queue.js";
import emailRoutes from "./routes/email.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // (Postman, server-to-server requests, etc.)
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "ReachInbox Email Scheduler API is running",
  });
});

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    service: "email-scheduler",
    status: "healthy",
  });
});

app.post("/test-queue", async (_req, res) => {
  try {
    const job = await emailQueue.add(
      "test-email",
      {
        message: "Hello from BullMQ",
      },
      {
        delay: 10000,
      }
    );

    res.json({
      success: true,
      message: "Job added successfully",
      jobId: job.id,
    });
  } catch (error) {
    console.error("Queue error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add job",
    });
  }
});

app.use("/api/emails", emailRoutes);
app.use("/api/auth", authRoutes);

export default app;