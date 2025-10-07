import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis({
  host: process.env.REDIS_IP,
  port: parseInt(process.env.REDIS_PORT),
});

redis.on("error", (err) => console.error("Redis error:", err));
redis.on("connect", () => console.log("Redis connected"));
redis.on("close", () => console.warn("Redis connection closed"));
