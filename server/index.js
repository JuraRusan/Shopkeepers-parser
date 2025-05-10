import http from "http";
import { languagesHandler } from "./controllers/languages.js";
import { shopsHandler } from "./controllers/shops.js";
import { userShopsHandler } from "./controllers/userShops.js";
import { userAllShopsHandler } from "./controllers/userAllShops.js";
import { logHandler } from "./controllers/log.js";
import { offersHandler } from "./controllers/offers.js";
import { editorHandler } from "./controllers/editor.js";

const id = "http://127.0.0.1:3000";

const listener = async (req, res) => {
  if (req.method === "GET" && req.url === "/languages") return languagesHandler(req, res, id);
  if (req.method === "GET" && req.url === "/shops") return shopsHandler(req, res, id);
  if (req.method === "GET" && req.url === "/user_shop") return userShopsHandler(req, res, id);
  if (req.method === "GET" && req.url === "/user_all_shop") return userAllShopsHandler(req, res, id);
  if (req.method === "GET" && req.url.startsWith("/log")) return logHandler(req, res, id);
  if (req.method === "GET" && req.url.startsWith("/offers")) return offersHandler(req, res, id);
  if (req.method === "GET" && req.url === "/data_editor") return editorHandler(req, res, id);
};

http.createServer(listener).listen(4000, () => {
  console.log("Server is running on port 4000");
});
