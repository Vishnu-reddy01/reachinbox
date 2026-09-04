import express from "express";
import cors from "cors";
import { emailQueue } from "./queues/email.queue.js";
import emailRoutes from "./routes/email.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
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