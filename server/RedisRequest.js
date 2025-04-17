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

// --------------------

export async function getItemEditEnchantments() {
  const redis = new Redis();
  const data = await redis.get("item_edit_enchantments");
  await redis.quit();

  return JSON.parse(data);
}

export async function getItemEditColors() {
  const redis = new Redis();
  const data = await redis.get("item_edit_colors");
  await redis.quit();

  return JSON.parse(data);
}

export async function getItemEditPatterns() {
  const redis = new Redis();
  const data = await redis.get("item_edit_trim_patterns");
  await redis.quit();

  return JSON.parse(data);
}

export async function getItemEditMaterials() {
  const redis = new Redis();
  const data = await redis.get("item_edit_trim_materials");
  await redis.quit();

  return JSON.parse(data);
}

export async function getItemEditBanners() {
  const redis = new Redis();
  const data = await redis.get("item_edit_banners");
  await redis.quit();

  return JSON.parse(data);
}

export async function getItemEditBannersPatterns() {
  const redis = new Redis();
  const data = await redis.get("item_edit_banner_patterns");
  await redis.quit();

  return JSON.parse(data);
}

export async function getItemEditShields() {
  const redis = new Redis();
  const data = await redis.get("item_edit_shields");
  await redis.quit();

  return JSON.parse(data);
}

export async function getItemEditAllItems() {
  const redis = new Redis();
  const data = await redis.get("item_edit_items_all");
  await redis.quit();

  return JSON.parse(data);
}
