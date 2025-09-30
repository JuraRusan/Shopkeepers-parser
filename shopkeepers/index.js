import cron from "node-cron";

import { Notifications } from "../notifications/notifications.js";
import { Offers } from "./parse_offers.js";
import { Users } from "./parse_user.js";
import { Logs } from "./parse_logs.js";
import { History } from "./generate_csv_all.js";

// Каждые 15 минут
cron.schedule("*/2 * * * *", async () => {
  await Offers();
  await Users();
});

// Каждый день в 00:05
cron.schedule("5 0 * * *", async () => {
  await Notifications();
});

// Каждый день в 00:02
cron.schedule("2 0 * * *", async () => {
  await History();
  await Logs();
});
