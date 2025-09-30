import http from "http";
import dotenv from "dotenv";

import { languagesHandler } from "./controllers/languages.js";
import { shopsHandler } from "./controllers/shops.js";
import { userShopsHandler } from "./controllers/userShops.js";
import { userAllShopsHandler } from "./controllers/userAllShops.js";
import { logHandler } from "./controllers/log.js";
import { offersHandler } from "./controllers/offers.js";

dotenv.config();

const listener = async (req, res) => {
  if (req.method === "GET" && req.url === "/languages") return languagesHandler(req, res, process.env.id);
  if (req.method === "GET" && req.url === "/shops") return shopsHandler(req, res, process.env.id);
  if (req.method === "GET" && req.url === "/user_shop") return userShopsHandler(req, res, process.env.id);
  if (req.method === "GET" && req.url === "/user_all_shop") return userAllShopsHandler(req, res, process.env.id);
  if (req.method === "GET" && req.url.startsWith("/log")) return logHandler(req, res, process.env.id);
  if (req.method === "GET" && req.url.startsWith("/offers")) return offersHandler(req, res, process.env.id);
};

http.createServer(listener).listen(Number(process.env.port), () => {
  console.log(`Сервер работает на порту ${process.env.port}`);
});
