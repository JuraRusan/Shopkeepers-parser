import { redis } from "../Redis.js";

export async function getShopkeepersShops() {
  const data = await redis.get("shopkeepers_shops");
  return JSON.parse(data);
}

export async function getShopkeepersLanguages() {
  const data = await redis.get("shopkeepers_languages");
  return JSON.parse(data);
}

export async function getShopkeepersOffers() {
  const data = await redis.get("shopkeepers_offers");
  return JSON.parse(data);
}

export async function getShopkeepersSearch() {
  const data = await redis.get("shopkeepers_search");
  return JSON.parse(data);
}

export async function getShopkeepersUserTraders() {
  const data = await redis.get("shopkeepers_user_traders");
  return JSON.parse(data);
}

export async function getShopkeepersLogsAllTraders() {
  const data = await redis.get("shopkeepers_logs_all_traders");
  return JSON.parse(data);
}

export async function getShopkeepersTradersLog() {
  const data = await redis.get("shopkeepers_traders_log");
  return JSON.parse(data);
}

export async function getShopkeepersCsvAllLogs() {
  const data = await redis.get("shopkeepers_csv_all_logs");
  return JSON.parse(data);
}
