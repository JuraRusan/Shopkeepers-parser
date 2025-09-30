import Redis from "ioredis";

import jsonData from "../data/lang.json" assert { type: "json" };

const redis = new Redis();
const keys = Object.keys(jsonData);

let enchantmentsKey = keys.filter((key) => key.includes("enchantment.minecraft"));
let enchantmentsValue = enchantmentsKey.reduce((result, key) => {
  result[key.replace("enchantment.minecraft.", "")] = jsonData[key];
  return result;
}, {});

let colorsKey = keys.filter((key) => key.includes("color.minecraft"));
let colorsValue = colorsKey.reduce((result, key) => {
  result[key.replace("color.minecraft.", "")] = jsonData[key];
  return result;
}, {});

let trimPatternsKey = keys.filter((key) => key.includes("trim_pattern.minecraft"));
let trimPatternsValue = trimPatternsKey.reduce((result, key) => {
  result[key.replace("trim_pattern.minecraft.", "")] = jsonData[key];
  return result;
}, {});

let trimMaterialsKey = keys.filter((key) => key.includes("trim_material.minecraft"));
let trimMaterialsValue = trimMaterialsKey.reduce((result, key) => {
  result[key.replace("trim_material.minecraft.", "")] = jsonData[key];
  return result;
}, {});

let bannersKey = keys.filter((key) => key.includes("block.minecraft.banner"));
let bannersValue = bannersKey.reduce((result, key) => {
  result[key.replace("block.minecraft.banner.", "")] = jsonData[key];
  return result;
}, {});

let shieldsKey = keys.filter((key) => key.includes("item.minecraft.shield"));
let shieldsValue = shieldsKey.reduce((result, key) => {
  result[key.replace("item.minecraft.", "")] = jsonData[key];
  return result;
}, {});

let bannerKeySingle = bannersKey
  .filter((key) => key.includes("white"))
  .map((el) => el.replace("block.minecraft.banner.", "").replace(".white", ""));

// redis.set("item_edit_enchantments", JSON.stringify(enchantmentsValue, null, 2));
// redis.set("item_edit_colors", JSON.stringify(colorsValue, null, 2));
// redis.set("item_edit_trim_patterns", JSON.stringify(trimPatternsValue, null, 2));
// redis.set("item_edit_trim_materials", JSON.stringify(trimMaterialsValue, null, 2));
// redis.set("item_edit_banners", JSON.stringify(bannersValue, null, 2));
// redis.set("item_edit_banner_patterns", JSON.stringify(bannerKeySingle, null, 2));
// redis.set("item_edit_shields", JSON.stringify(shieldsValue, null, 2));

console.log(shieldValue);

// let discsKey = keys.filter((key) => key.includes("item.minecraft.music_disc_")).filter((key) => key.includes(".desc"));
// let discsValue = discsKey.reduce((result, key) => {
//   result[key.replace("item.minecraft.", "").replace(".desc", "")] = jsonData[key];
//   return result;
// }, {});

// let bannerKeySingle = bannersKey.filter((key) => key.includes("white"));
// let bannerSingleValue = bannerKeySingle.reduce((result, key) => {
//   let str = jsonData[key]
//     .split(" ")
//     .slice(1)
//     .map((c) => c.charAt(0).toUpperCase() + c.slice(1));
//
//   result[key.replace("block.minecraft.banner.", "").replace(".white", "")] = str.join(" ");
//   return result;
// }, {});
