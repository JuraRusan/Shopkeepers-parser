import { getShopkeepersLanguages } from "../RedisRequest.js";

export const languagesHandler = async (req, res, id) => {
  const data = await getShopkeepersLanguages();

  res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": id });
  res.end(JSON.stringify({ data: data }));
};
