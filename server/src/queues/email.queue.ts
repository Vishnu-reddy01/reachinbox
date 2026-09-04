import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const EMAIL_QUEUE_NAME = "email-scheduler";

export const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: 1000,
    removeOnFail: 5000,
  },
});