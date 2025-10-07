import { redis } from "../Redis.js";

export async function getShopkeepersShops() {
  const data = await redis.get("shops");
  return JSON.parse(data);
}

export async function getShopkeepersLanguages() {
  const data = await redis.get("languages");
  return JSON.parse(data);
}

export async function getShopkeepersOffers() {
  const data = await redis.get("offers");
  return JSON.parse(data);
}

export async function getShopkeepersSearch() {
  const data = await redis.get("search");
  return JSON.parse(data);
}

export async function getShopkeepersUserTraders() {
  const data = await redis.get("user_traders");
  return JSON.parse(data);
}

export async function getShopkeepersLogsAllTraders() {
  const data = await redis.get("logs_all_traders");
  return JSON.parse(data);
}

export async function getShopkeepersTradersLog() {
  const data = await redis.get("traders_log");
  return JSON.parse(data);
}

export async function getShopkeepersCsvAllLogs() {
  const data = await redis.get("csv_all_logs");
  return JSON.parse(data);
}
