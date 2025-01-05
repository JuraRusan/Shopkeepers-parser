import Redis from "ioredis";

export async function getShopkeepersShops() {
  const redis = new Redis();
  const data = await redis.get("shopkeepers_shops");
  await redis.quit();

  return JSON.parse(data);
}

export async function getShopkeepersLanguages() {
  const redis = new Redis();
  const data = await redis.get("shopkeepers_languages");
  await redis.quit();

  return JSON.parse(data);
}

export async function getShopkeepersOffers() {
  const redis = new Redis();
  const data = await redis.get("shopkeepers_offers");
  await redis.quit();

  return JSON.parse(data);
}

export async function getShopkeepersSearch() {
  const redis = new Redis();
  const data = await redis.get("shopkeepers_search");
  await redis.quit();

  return JSON.parse(data);
}

export async function getShopkeepersUserTraders() {
  const redis = new Redis();
  const data = await redis.get("shopkeepers_user_traders");
  await redis.quit();

  return JSON.parse(data);
}

export async function getShopkeepersLogsAllTraders() {
  const redis = new Redis();
  const data = await redis.get("shopkeepers_logs_all_traders");
  await redis.quit();

  return JSON.parse(data);
}

export async function getShopkeepersTradersLog() {
  const redis = new Redis();
  const data = await redis.get("shopkeepers_traders_log");
  await redis.quit();

  return JSON.parse(data);
}

export async function getShopkeepersCsvAllLogs() {
  const redis = new Redis();
  const data = await redis.get("shopkeepers_csv_all_logs");
  await redis.quit();

  return JSON.parse(data);
}
