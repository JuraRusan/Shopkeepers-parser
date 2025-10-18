import dotenv from "dotenv";
import { redis } from "../Redis.js";
import axios from "axios";

dotenv.config();

export async function Notifications() {
  let users;

  const data = await redis.get("user_traders");

  if (!data) {
    console.warn("Нет данных в Redis по ключу user_traders");
    return;
  }

  try {
    users = JSON.parse(data);
  } catch (err) {
    console.error("Ошибка при парсинге JSON:", err);
    return;
  }

  if (!Array.isArray(users)) {
    console.warn("Данные из Redis — не массив пользователей");
    return;
  }

  const currentDate = new Date();

  for (const user of users) {
    const lastSeenDate = new Date(user.last_seen);

    if (isNaN(lastSeenDate)) {
      console.warn(`Неверная дата у пользователя ${user.owner}: ${user.last_seen}`);
      continue;
    }

    const expirationDate = new Date(
      lastSeenDate.getTime() + parseInt(process.env.THRESHOLD_DAYS) * 24 * 60 * 60 * 1000
    );
    const daysLeft = Math.floor((expirationDate - currentDate) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 7) {
      try {
        await axios
          .post("http://localhost:6543/api/shopkeepers_notifications", user, {
            headers: {
              Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
              "Content-Type": "application/json",
            },
          })
          .then(function (response) {
            console.log(response.data.message);
          })
          .catch(function (error) {
            console.log(error);
          });

        console.log(`${new Date().toISOString()} | User ${user.owner} — осталось ${daysLeft} дней\n `);
      } catch (error) {
        console.error(`Ошибка при обработке данных ${user.owner}:`, error);
      }
    }
  }
}
