import fs from "fs-extra";
import Papa from "papaparse";
import path from "path";
import yaml from "js-yaml";
import Database from "better-sqlite3";
import { redis } from "../Redis.js";

const database = new Database("./trade-logs/trades.db", { readonly: true });

const out = [];
const all = {};

const parseMetadata = (meta) => {
  try {
    return yaml.load(meta);
  } catch (e) {
    console.error(`Ошибка при парсинге ${meta}:`, e);
    return {};
  }
};

const timestampCSV = (data, time) => {
  const [day, month, year] = data.split(".").map(Number);
  const [hours, minutes, seconds] = time.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
};

const timestampDB = (isoString) => {
  return new Date(isoString.replace(/\.\d{6,9}Z$/, "Z")).getTime();
};

async function readCSV(filePath) {
  const csvFile = fs.readFileSync("./trade-logs/" + filePath);
  const csvData = csvFile.toString();

  return new Promise((resolve) => {
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const value = [...results.data];

        const data = filePath.split("-");

        for (let v = 0; v < value.length; v++) {
          out.push({
            time: timestampCSV(data[3].split(".")[0] + "." + data[2] + "." + data[1], value[v].time),
            player_name: value[v].player_name,
            shop_uuid: value[v].shop_uuid,
            trade_count: value[v].trade_count,
            item1: !value[v].item1_type
              ? undefined
              : {
                  amount: value[v].item1_amount,
                  type: value[v].item1_type,
                  meta: parseMetadata(value[v].item1_metadata)?.meta,
                },
            item2: !value[v].item2_type
              ? undefined
              : {
                  amount: value[v]?.item2_amount,
                  type: value[v]?.item2_type,
                  meta: parseMetadata(value[v].item2_metadata)?.meta,
                },
            resultItem: !value[v].result_item_type
              ? undefined
              : {
                  amount: value[v].result_item_amount,
                  type: value[v].result_item_type,
                  meta: parseMetadata(value[v].result_item_metadata)?.meta,
                },
          });

          const id = value[v].shop_uuid;

          if (all[id]) {
            all[id].logs_count = all[id].logs_count + 1 * value[v].trade_count;
          } else {
            all[id] = {
              logs_count: value[v].trade_count,
              owner_name: value[v].shop_owner_name,
              x: value[v].shop_x,
              y: value[v].shop_y,
              z: value[v].shop_z,
            };
          }
        }

        resolve(results.data);
      },
    });
  });
}

async function readDB(data) {
  const id = data.shop_uuid;

  if (all[id]) {
    all[id].logs_count = all[id].logs_count + 1 * data.trade_count;
  } else {
    all[id] = {
      logs_count: data.trade_count,
      owner_name: data.shop_owner_name,
      x: data.shop_x,
      y: data.shop_y,
      z: data.shop_z,
    };
  }

  out.push({
    time: timestampDB(data.timestamp),
    player_name: data.player_name,
    shop_uuid: data.shop_uuid,
    trade_count: data.trade_count,
    item1: !data.item_1_type
      ? undefined
      : {
          id: data.item_1_type.toLowerCase(),
          count: data.item_1_amount,
          components: parseMetadata(data.item_1_metadata)?.components,
        },
    item2: !data.item_2_type
      ? undefined
      : {
          id: (data?.item_2_type).toLowerCase(),
          count: data?.item_2_amount,
          components: parseMetadata(data.item_3_metadata)?.components,
        },
    resultItem: !data.result_item_type
      ? undefined
      : {
          id: data.result_item_type.toLowerCase(),
          count: data.result_item_amount,
          components: parseMetadata(data.result_item_metadata)?.components,
        },
  });
}

async function parseCSV() {
  try {
    const files = await fs.promises.readdir("./trade-logs");
    const csvFiles = files.filter((file) => path.extname(file) === ".csv");

    for (const file of csvFiles) {
      await readCSV(file);
    }
  } catch (error) {
    console.error(`Ошибка обработки файлов: ${error}`);
  }
}

async function parseDB() {
  try {
    const array = database.prepare("SELECT * FROM trade").all();

    for (let c = 0; c < array.length; c++) {
      await readDB(array[c]);
    }
  } catch (error) {
    console.error(`Ошибка обработки базы данных: ${error}`);
  }
}

export async function History() {
  await parseCSV();
  await parseDB();
  await redis.set("shopkeepers_logs_all_traders", JSON.stringify(all, null, 2));
  await redis.set("shopkeepers_csv_all_logs", JSON.stringify(out, null, 2));
  database.close();
}
