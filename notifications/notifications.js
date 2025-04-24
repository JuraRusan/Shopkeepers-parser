import Redis from "ioredis";
import { EmbedBuilder, WebhookClient } from "discord.js";

const thresholdDays = 30;

const webhookClient = new WebhookClient({
  url: "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
});

async function Embed(user) {
  const deletionTime = Math.floor((user.last_seen + 2592000000) / 1000);

  return new EmbedBuilder()
    .setTitle(`🛒 Уведомление о магазинах для \`${user.owner}\``)
    .setColor(0x00ffff)
    .setDescription(
      `Это автоматическое уведомление, чтобы игрок случайно не забыл, что <t:${deletionTime}:R> его магазины будут удалены.\n\n` +
        `Cписок магазинов, которые удаляются: ` +
        user.villager
          .map((x) => `[${x.name === "" ? user.owner : x.name}](https://gmgame.ru/shopkeepers?_uuid=${x.uuid})`)
          .join(", ") +
        `\n\n_Рекомендуется как можно раньше зайти на основной сервер, чтобы сохранить магазины — время приблизительное и может немного отличаться._`
    );
}

async function Notifications() {
  let users;

  const redis = new Redis();
  const data = await redis.get("shopkeepers_user_traders");
  await redis.quit();

  if (!data) {
    console.warn("Нет данных в Redis по ключу shopkeepers_user_traders");
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

    const expirationDate = new Date(lastSeenDate.getTime() + thresholdDays * 24 * 60 * 60 * 1000);
    const daysLeft = Math.floor((expirationDate - currentDate) / (1000 * 60 * 60 * 24));

    if (daysLeft <= 7) {
      try {
        await webhookClient.send({
          username: "GMGame Shop Notifications",
          avatarURL: "https://i.imgur.com/AfFp7pu.png",
          embeds: [await Embed(user)],
        });

        console.log(`User ${user.owner} — осталось ${daysLeft} дней`);
      } catch (error) {
        console.error(`Ошибка при обработке данных ${user.owner}:`, error);
      }
    }
  }
}

Notifications();
