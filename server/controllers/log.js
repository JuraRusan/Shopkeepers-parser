import url from "url";
import { getShopkeepersTradersLog } from "../RedisRequest.js";

export const logHandler = async (req, res, id) => {
  const data = await getShopkeepersTradersLog();

  const parsedUrl = url.parse(req.url, true);
  const { _uuid } = parsedUrl.query;

  let filteredLogs;

  if (_uuid) {
    filteredLogs = data[_uuid];
  } else {
    filteredLogs = data;
  }

  res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": id });
  res.end(JSON.stringify({ data: filteredLogs }));
};
