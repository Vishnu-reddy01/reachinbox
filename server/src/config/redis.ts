import { Redis } from "ioredis";

const redisUrl = process.env.REDIS_URL;

const redis = redisUrl
  ? new Redis(redisUrl, {
      maxRetriesPerRequest: null,
    })
  : new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
      maxRetriesPerRequest: null,
    });

redis.on("connect", () => {
  console.log("Redis connected successfully");
});

redis.on("error", (error: Error) => {
  console.error("Redis connection error:", error);
});

export default redis;