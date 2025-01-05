import Redis from "ioredis";
import { generate20 } from "./1.20/generate.js";
import { generate21 } from "./1.21/generate.js";
import { getShopkeepersCsvAllLogs } from "../server/RedisRequest.js";

const redis = new Redis();

const update = 1724360400; // Переход сервера на 1.21

async function selectLogs(data) {
  const selectedData = {};

  for (const el of data) {
    let resultItem = {};
    let item1 = {};
    let item2 = {};
    let lang = {};

    const convertDateToUnix = (dateStr) => {
      const [day, month, year] = dateStr.split(".").map(Number);
      const date = new Date(Date.UTC(year, month - 1, day));

      return Math.floor(date.getTime() / 1000);
    };

    // < 1.21
    if (update > convertDateToUnix(el.data)) {
      resultItem = el.resultItem ? await generate20(el.resultItem, lang) : {};
      item1 = el.item1 ? await generate20(el.item1, lang) : {};
      item2 = el.item2 ? await generate20(el.item2, lang) : {};
    }

    // 1.21 >
    if (update < convertDateToUnix(el.data)) {
      resultItem = el.resultItem ? await generate21(el.resultItem, lang) : {};
      item1 = el.item1 ? await generate21(el.item1, lang) : {};
      item2 = el.item2 ? await generate21(el.item2, lang) : {};
    }

    if (selectedData[el.shop_uuid]) {
      selectedData[el.shop_uuid].lang = { ...selectedData[el.shop_uuid].lang, ...lang };
      selectedData[el.shop_uuid].value.push({
        data: el.data,
        time: el.time,
        player_name: el.player_name,
        trade_count: el.trade_count,
        shop_owner_name: el.shop_owner_name,
        resultItem: resultItem,
        item1: item1,
        item2: item2,
      });
    } else {
      selectedData[el.shop_uuid] = {
        lang: lang,
        value: [
          {
            data: el.data,
            time: el.time,
            player_name: el.player_name,
            trade_count: el.trade_count,
            shop_owner_name: el.shop_owner_name,
            resultItem: resultItem,
            item1: item1,
            item2: item2,
          },
        ],
      };
    }
  }

  return selectedData;
}

(async () => {
  const dataAll = await getShopkeepersCsvAllLogs();
  const logs = await selectLogs(dataAll);

  await redis.set("shopkeepers_traders_log", JSON.stringify(logs, null, 2));
  redis.quit();
})();
