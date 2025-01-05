import fs from "fs-extra";
import yaml from "js-yaml";
import Redis from "ioredis";

import { generate21 } from "./1.21/generate.js";

const redis = new Redis();

const fileContents = fs.readFileSync("./save.yml", "utf8");
const data = yaml.load(fileContents);

delete data["data-version"];

async function selectOffers(data) {
  const selectedData = [];
  const languages = {};
  const search = [];

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const dataObject = data[key];
      const offers = dataObject.offers || {};
      const offerKeys = Object.keys(offers);

      const oneOffer = [];

      await Promise.all(
        offerKeys.map(async (i) => {
          const blockOffer = offers[i];
          const shopId = dataObject.uniqueId;

          oneOffer.push({
            id: i,
            shop_id: shopId,
            // prettier-ignore
            resultItem: blockOffer.resultItem ? await generate21(blockOffer.resultItem, languages, shopId, i, search) : {},
            item1: blockOffer.item1 ? await generate21(blockOffer.item1, languages, shopId, i, search) : {},
            item2: blockOffer.item2 ? await generate21(blockOffer.item2, languages, shopId, i, search) : {},
          });
        })
      );

      selectedData.push(...oneOffer);
    }
  }

  function removeDuplicates(data) {
    let obj = {};
    for (let index in data) {
      if (data[index][0]) {
        if (!obj[data[index][0]]) {
          obj[data[index][0]] = {};
        }

        if (!obj[data[index][0]][data[index][1]]) {
          obj[data[index][0]][data[index][1]] = [];
        }

        obj[data[index][0]][data[index][1]].push(data[index][2]);
      }
    }

    for (let category in obj) {
      for (let id in obj[category]) {
        obj[category][id] = Array.from(new Set(obj[category][id]));
      }
    }

    return obj;
  }

  return { lang: languages, value: selectedData, src: removeDuplicates(search) };
}

async function selectShops(data) {
  const selectedData = {};

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const dataObject = data[key];

      selectedData[`${dataObject.uniqueId}`] = {
        x: dataObject.x,
        y: dataObject.y,
        z: dataObject.z,
        name: dataObject.name,
        owner: dataObject.owner,
        offers: Object.keys(dataObject.offers).length,
        object_profession: dataObject.object ? dataObject.object.profession.replace("minecraft:", "") : null,
        object_villager_type: dataObject.object ? dataObject.object.villagerType.replace("minecraft:", "") : null,
      };
    }
  }

  return selectedData;
}

(async () => {
  const offersData = await selectOffers(data);
  const shopsData = await selectShops(data);

  await redis.set("shopkeepers_offers", JSON.stringify(offersData.value, null, 2));
  await redis.set("shopkeepers_languages", JSON.stringify(offersData.lang, null, 2));
  await redis.set("shopkeepers_search", JSON.stringify(offersData.src, null, 2));
  await redis.set("shopkeepers_shops", JSON.stringify(shopsData, null, 2));

  redis.quit();
})();
