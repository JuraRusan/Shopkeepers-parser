import { getShopkeepersUserTraders } from "../RedisRequest.js";

export const userShopsHandler = async (req, res, id) => {
  const data = await getShopkeepersUserTraders();

  res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": id });
  res.end(JSON.stringify({ data: data }));
};
