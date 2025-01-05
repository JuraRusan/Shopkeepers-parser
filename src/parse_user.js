import fs from "fs-extra";
import yaml from "js-yaml";
import Redis from "ioredis";
import Database from "better-sqlite3";

import { getShopkeepersLogsAllTraders } from "../server/RedisRequest.js";

const fileContents = fs.readFileSync("./save.yml", "utf8");
const data = yaml.load(fileContents);

delete data["data-version"];

const redis = new Redis();

function openDatabase() {
  return new Database("./cmi.sqlite.db", { readonly: true });
}

const db = openDatabase();

const TradersAllLog = await getShopkeepersLogsAllTraders();

async function searchAndRetrieveLastLoginTime(searchText) {
  try {
    const login = db.prepare("SELECT LastLoginTime FROM users WHERE player_uuid LIKE ?");
    const rowLogin = login.get(`%${searchText}%`);

    const out = db.prepare("SELECT LastLogoffTime FROM users WHERE player_uuid LIKE ?");
    const rowOut = out.get(`%${searchText}%`);

    if (rowLogin || rowOut) {
      return rowLogin.LastLoginTime > rowOut.LastLogoffTime ? rowLogin.LastLoginTime : rowOut.LastLogoffTime;
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
}

async function groupDataByOwner(data) {
  const groupedData = {};
  const ownerPromises = [];

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const dataObj = data[key];
      const owner = dataObj.owner;

      const ownerPromise = searchAndRetrieveLastLoginTime(dataObj["owner uuid"]).then((last_seen) => {
        if (!groupedData[owner]) {
          groupedData[owner] = {
            owner: owner,
            last_seen: last_seen,
            villager: [],
          };
        }

        groupedData[owner].villager.push({
          id: key,
          uuid: dataObj.uniqueId,
          log: !TradersAllLog[dataObj.uniqueId] ? 0 : TradersAllLog[dataObj.uniqueId].logs_count,
          x: dataObj.x,
          y: dataObj.y,
          z: dataObj.z,
          name: dataObj.name,
          object_profession: dataObj.object ? dataObj.object.profession.replace("minecraft:", "") : null,
          object_villager_type: dataObj.object ? dataObj.object.villagerType.replace("minecraft:", "") : null,
        });
      });

      ownerPromises.push(ownerPromise);
    }
  }

  await Promise.all(ownerPromises);

  return Object.values(groupedData);
}

(async () => {
  const userData = await groupDataByOwner(data);

  await redis.set("shopkeepers_user_traders", JSON.stringify(userData, null, 2));

  db.close();
  redis.quit();
})();
