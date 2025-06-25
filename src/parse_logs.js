import Redis from "ioredis";
import fs from "fs-extra";
import { parseOld } from "./functions/old.js";
import { parseYamlStructure } from "./functions/main.js";
import { getShopkeepersCsvAllLogs } from "../server/RedisRequest.js";

const redis = new Redis();

const update = 1748166747000; // cплит старого формата

async function selectLogs(data) {
  const selectedData = {};

  for (const el of data) {
    let resultItem = {};
    let item1 = {};
    let item2 = {};
    let lang = {};

    // < 1.21
    if (update > el.time) {
      item1 = el.item1 ? await parseOld(el.item1) : {};
      item2 = el.item2 ? await parseOld(el.item2) : {};
      resultItem = el.resultItem ? await parseOld(el.resultItem) : {};
    }

    // 1.21 >
    if (update < el.time) {
      item1 = el.item1 ? await parseYamlStructure(el.item1, lang) : {};
      item2 = el.item2 ? await parseYamlStructure(el.item2, lang) : {};
      resultItem = el.resultItem ? await parseYamlStructure(el.resultItem, lang) : {};
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
  const logs = await selectLogs(await getShopkeepersCsvAllLogs());

  await redis.set("shopkeepers_traders_log", JSON.stringify(logs, null, 2));

  fs.writeFile(`./src/debug_logs_3.json`, JSON.stringify(logs, null, 2));

  redis.quit();
})();
