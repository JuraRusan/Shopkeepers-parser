import fs from "fs-extra";
import Papa from "papaparse";
import path from "path";
import yaml from "js-yaml";
import Redis from "ioredis";

const redis = new Redis();

const inputDir = "./trade-logs";

const out = [];
const all = {};

function parseResultItemMetadata(meta) {
  try {
    return yaml.load(meta);
  } catch (e) {
    console.error(`Ошибка при парсинге ${meta}:`, e);
    return {};
  }
}

const readCSV = async (filePath) => {
  const csvFile = fs.readFileSync(inputDir + "/" + filePath);
  const csvData = csvFile.toString();

  return new Promise((resolve) => {
    Papa.parse(csvData, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        const value = [...results.data];

        const data = filePath.split("-");

        for (let v = 0; v < value.length; v++) {
          out.push({
            data: data[3].split(".")[0] + "." + data[2] + "." + data[1],
            time: value[v].time,
            player_name: value[v].player_name,
            shop_uuid: value[v].shop_uuid,
            trade_count: value[v].trade_count,
            item1: !value[v].item1_type
              ? undefined
              : {
                  amount: value[v].item1_amount,
                  type: value[v].item1_type,
                  meta: parseResultItemMetadata(value[v].item1_metadata)?.meta,
                },
            item2: !value[v].item2_type
              ? undefined
              : {
                  amount: value[v]?.item2_amount,
                  type: value[v]?.item2_type,
                  meta: parseResultItemMetadata(value[v].item2_metadata)?.meta,
                },
            resultItem: !value[v].result_item_type
              ? undefined
              : {
                  amount: value[v].result_item_amount,
                  type: value[v].result_item_type,
                  meta: parseResultItemMetadata(value[v].result_item_metadata)?.meta,
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
};

async function parseCSVFiles() {
  try {
    const getDateStart = new Date();

    const files = await fs.promises.readdir(inputDir);
    const csvFiles = files.filter((file) => path.extname(file) === ".csv");

    for (const file of csvFiles) {
      readCSV(file);
    }

    await redis.set("shopkeepers_logs_all_traders", JSON.stringify(all, null, 2));
    await redis.set("shopkeepers_csv_all_logs", JSON.stringify(out, null, 2));

    redis.quit();
    const getDateEnd = new Date();

    console.log(getDateEnd - getDateStart + "ms");
  } catch (error) {
    console.error(`Ошибка обработки файлов: ${error}`);
  }
}

parseCSVFiles();
