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


// Live BullMQ queue status API
app.get("/api/queue/status", async (_req, res) => {
  try {
    const counts = await emailQueue.getJobCounts(
      "waiting",
      "active",
      "delayed",
      "completed",
      "failed"
    );
    const jobs = await emailQueue.getJobs(["waiting", "active", "delayed", "failed"], 0, 49, false);
    res.json({
      success: true,
      queue: "email-scheduler",
      counts,
      jobs: jobs.map((job) => ({
        id: job.id,
        name: job.name,
        state: undefined,
        recipient: job.data?.recipient,
        emailId: job.data?.emailId,
        timestamp: job.timestamp,
        delay: job.delay,
        attemptsMade: job.attemptsMade,
        failedReason: job.failedReason || null,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load queue status" });
  }
});

// Lightweight live BullMQ dashboard (auto-refreshes every 2 seconds)
app.get("/admin/queues", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>ReachInbox BullMQ Dashboard</title>
<style>body{font-family:system-ui;background:#0b0f14;color:#e5e7eb;margin:0;padding:24px}.wrap{max-width:1100px;margin:auto}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px}.card,.panel{background:#111827;border:1px solid #263244;border-radius:12px;padding:16px}.n{font-size:28px;font-weight:700}.label{color:#94a3b8;font-size:12px}table{width:100%;border-collapse:collapse;margin-top:12px}th,td{text-align:left;padding:10px;border-bottom:1px solid #263244;font-size:13px}th{color:#94a3b8}h1{margin-top:0}</style></head>
<body><div class="wrap"><h1>ReachInbox BullMQ Dashboard</h1><p id="updated" class="label"></p><div id="cards" class="cards"></div><div class="panel" style="margin-top:16px"><h3>Current jobs</h3><table><thead><tr><th>ID</th><th>Recipient</th><th>Attempts</th><th>Failure</th></tr></thead><tbody id="jobs"></tbody></table></div></div>
<script>async function load(){try{const r=await fetch('/api/queue/status');const d=await r.json();const c=d.counts||{};document.getElementById('cards').innerHTML=['waiting','active','delayed','completed','failed'].map(k=>'<div class="card"><div class="n">'+(c[k]||0)+'</div><div class="label">'+k.toUpperCase()+'</div></div>').join('');document.getElementById('jobs').innerHTML=(d.jobs||[]).map(j=>'<tr><td>'+String(j.id||'')+'</td><td>'+String(j.recipient||'-')+'</td><td>'+j.attemptsMade+'</td><td>'+String(j.failedReason||'-')+'</td></tr>').join('');document.getElementById('updated').textContent='Updated: '+new Date().toLocaleTimeString();}catch(e){document.getElementById('updated').textContent='Dashboard error: '+e.message}}load();setInterval(load,2000);</script></body></html>`);
});

app.use("/api/emails", emailRoutes);
app.use("/api/auth", authRoutes);

export default app;