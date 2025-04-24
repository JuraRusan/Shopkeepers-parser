// import Redis from "ioredis";
// import puppeteer from "puppeteer";
// import fs from "fs-extra";
// import { WebhookClient, AttachmentBuilder, EmbedBuilder } from "discord.js";
// import path from "path";
// import { htmlContent } from "./htmlContent.js";
//
// const imageDir = "./notifications/images";
// const thresholdDays = 30;
//
// const webhookClient = new WebhookClient({
//   url: "0000000000000000000000000000000000000000000000000000000000000000",
// });
//
// async function Embed(user) {
//   return new EmbedBuilder()
//     .setTitle(`🛒 Уведомление о магазинах для ${user}`)
//     .setColor(0x00ffff)
//     .setDescription(
//       `Это автоматическое уведомление, чтобы игрок случайно не забыл, что **через некоторое время его магазины будут удалены**.\n\n` +
//         `Ниже будет список магазинов, которые **удаляются**.\n\n` +
//         `_Рекомендуется зайти в игру на основной сервер, чтобы сохранить магазины._`
//     );
// }
//
// async function clearImageDirectory() {
//   try {
//     await fs.emptyDir(imageDir);
//     console.log("Папка очищена");
//   } catch (err) {
//     console.error("Ошибка при очистке папки:", err);
//   }
// }
//
// async function GenerateImageFromHTML(html, outputPath, viewport = { width: 750, height: 375 }) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//
//   await page.setContent(html, { waitUntil: "networkidle0" });
//   await page.setViewport(viewport);
//
//   await page.screenshot({ path: outputPath });
//   const screenshotData = await page.screenshot({ encoding: "base64" });
//
//   await browser.close();
//
//   return screenshotData;
// }
//
// async function Notifications() {
//   let users;
//
//   const redis = new Redis();
//   const data = await redis.get("shopkeepers_user_traders");
//   await redis.quit();
//
//   if (!data) {
//     console.warn("Нет данных в Redis по ключу shopkeepers_user_traders");
//     return;
//   }
//
//   try {
//     users = JSON.parse(data);
//   } catch (err) {
//     console.error("Ошибка при парсинге JSON:", err);
//     return;
//   }
//
//   if (!Array.isArray(users)) {
//     console.warn("Данные из Redis — не массив пользователей");
//     return;
//   }
//
//   const currentDate = new Date();
//   await clearImageDirectory();
//
//   for (const user of users) {
//     const lastSeenDate = new Date(user.last_seen);
//     if (isNaN(lastSeenDate)) {
//       console.warn(`Неверная дата у пользователя ${user.owner}: ${user.last_seen}`);
//       continue;
//     }
//
//     const expirationDate = new Date(lastSeenDate.getTime() + thresholdDays * 24 * 60 * 60 * 1000);
//     const daysLeft = Math.floor((expirationDate - currentDate) / (1000 * 60 * 60 * 24));
//
//     if (daysLeft <= 3) {
//       console.log(`User ${user.owner} — осталось ${daysLeft} дней`);
//
//       for (let index = 0; index < user.villager.length; index++) {
//         try {
//           const html = htmlContent({ user, index });
//           const imagePath = path.join(imageDir, `${user.owner}_${index}.png`);
//
//           const image = await GenerateImageFromHTML(html, imagePath);
//           const imageBuffer = Buffer.from(image, "base64");
//
//           console.log(`Изображение для ${user.owner}_${index} готово`);
//
//           if (index === 0) {
//             await webhookClient.send({
//               username: "GMGame Shop Notifications",
//               avatarURL: "https://i.imgur.com/AfFp7pu.png",
//               embeds: [await Embed(user.owner)],
//             });
//           }
//
//           await webhookClient.send({
//             username: "GMGame Shop Notifications",
//             avatarURL: "https://i.imgur.com/AfFp7pu.png",
//             files: [new AttachmentBuilder(imageBuffer, { name: `${user.owner}_${index}.png` })],
//           });
//         } catch (error) {
//           console.error(`Ошибка при генерации изображения для ${user.owner}_${index}:`, error);
//         }
//       }
//     }
//   }
// }
//
// Notifications();
