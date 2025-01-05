import { getShopkeepersLogsAllTraders } from "../RedisRequest.js";

export const userAllShopsHandler = async (req, res, id) => {
  const data = await getShopkeepersLogsAllTraders();

  res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": id });
  res.end(JSON.stringify({ data: data }));
};
