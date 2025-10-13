import cron from "node-cron";
import { redis } from "../Redis.js";
import { Notifications } from "../notifications/notifications.js";
import { Offers } from "./parse_offers.js";
import { Users } from "./parse_user.js";
import { Logs } from "./parse_logs.js";
import { History } from "./generate_csv_all.js";

// Каждые 15 минут
cron.schedule("*/15 * * * *", async () => {
  await Offers();
  await Users();

  console.log(`${new Date().toISOString() + " | Offers + Users"}`);
});

// Каждый день в 00:05
cron.schedule("5 0 * * *", async () => {
  await Notifications();
});

// Каждый день в 00:02
cron.schedule("2 0 * * *", async () => {
  await History();
  await Logs();

  console.log(`${new Date().toISOString() + " | History + Logs"}`);
});

async function shutdown() {
  try {
    await redis.quit();

    console.log("Redis connection closed");
    process.exit(0);
  } catch (err) {
    console.error("Error closing Redis:", err);
    process.exit(1);
  }
}

process.on("SIGINT", () => shutdown()); // Ctrl+C
process.on("SIGTERM", () => shutdown()); // kill
process.on("SIGHUP", () => shutdown()); // закрытие терминала
