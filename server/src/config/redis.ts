import "dotenv/config";

import { Redis } from "ioredis";

const redisHost = process.env.REDIS_HOST;
const redisPort = Number(process.env.REDIS_PORT || 6379);
const redisPassword = process.env.REDIS_PASSWORD;

if (!redisHost || !redisPassword) {
  throw new Error("REDIS_HOST or REDIS_PASSWORD is not defined");
}

const redis = new Redis({
  host: redisHost,
  port: redisPort,
  username: "default",
  password: redisPassword,
  tls: {},
  maxRetriesPerRequest: null,
});

redis.on("connect", () => {
  console.log("Redis connected successfully");
});

redis.on("ready", () => {
  console.log("Redis ready");
});

redis.on("error", (error: Error) => {
  console.error("Redis connection error:", error);
});

export default redis;