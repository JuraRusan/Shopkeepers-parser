import { getShopkeepersShops } from "../RedisRequest.js";

export const shopsHandler = async (req, res, id) => {
  const data = await getShopkeepersShops();

  res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": id });
  res.end(JSON.stringify({ data: data }));
};
