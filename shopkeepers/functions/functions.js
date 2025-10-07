import convert from "color-convert";
import fs from "fs-extra";

import { parse, stringify } from "nbt-ts";
import { parseContainerStructure } from "./main.js";

const jsonLang = fs.readJSONSync(new URL("../../data/lang.json", import.meta.url));

const colorNames = {
  ...convert.keyword.rgb,
  black: [0, 0, 0],
  dark_blue: [0, 0, 170],
  dark_green: [0, 170, 0],
  dark_aqua: [0, 170, 170],
  dark_red: [170, 0, 0],
  dark_purple: [170, 0, 170],
  gold: [255, 170, 0],
  gray: [170, 170, 170],
  dark_gray: [85, 85, 85],
  blue: [85, 85, 255],
  green: [85, 255, 85],
  aqua: [85, 255, 255],
  red: [255, 85, 85],
  light_purple: [255, 85, 255],
  yellow: [255, 255, 85],
  white: [255, 255, 255],
};

function decodeColor(color) {
  return {
    red: (color >> 16) & 255,
    green: (color >> 8) & 255,
    blue: color & 255,
  };
}

function ConvertColorToHex(color) {
  if (colorNames[color]) {
    const [r, g, b] = colorNames[color];
    const hex = convert.rgb.hex([r, g, b]);

    return `#${hex}`;
  }

  return color;
}

export async function replaceString(str) {
  return str.replace("minecraft:", "");
}

export async function MinecraftId(id, lang, shop, offer, src) {
  const newId = await replaceString(id);

  const translate = jsonLang[`block.minecraft.${newId}`] || jsonLang[`item.minecraft.${newId}`];
  const records = jsonLang[`item.minecraft.${newId}.desc`];

  lang[newId] = translate;
  lang[`${newId}.desc`] = records;

  src?.push([translate, shop, offer]);
  src?.push([records, shop, offer]);

  if (newId.includes("netherite_upgrade")) {
    const netherite = jsonLang[`upgrade.minecraft.netherite_upgrade`];

    lang[`upgrade.${newId}`] = netherite;
    src?.push([netherite, shop, offer]);
  }

  if (newId.includes("smithing_template")) {
    const template = jsonLang[`trim_pattern.minecraft.${newId.split("_")[0]}`];

    lang[`template.${newId}`] = template;
    src?.push([template, shop, offer]);
  }

  return newId;
}

export async function convertFirework(data) {
  return parse(data).flight_duration.value;
}

export async function convertEnchantments(data, lang, shop, offer, src) {
  const entriesEnchantments = Object.entries(parse(data));

  return await Promise.all(
    entriesEnchantments.map(async ([key, { value }]) => {
      const id = await replaceString(key);
      const lvl = value;

      const translate = jsonLang[`enchantment.minecraft.${id}`];

      lang[`enchantment.${id}`] = translate;
      lang[`enchantment.level.${lvl}`] = jsonLang[`enchantment.level.${lvl}`];

      src?.push([translate, shop, offer]);

      return { id, lvl };
    })
  );
}

export async function convertInstrument(data, lang, shop, offer, src) {
  const instrument = await replaceString(parse(data));
  const translate = jsonLang[`instrument.minecraft.${instrument}`];

  lang[`goat_horn.${instrument}`] = translate;

  src?.push([translate, shop, offer]);

  return instrument;
}

export async function convertTrim(data, lang, shop, offer, src) {
  const trim = parse(data);

  const material = await replaceString(trim.material);
  const pattern = await replaceString(trim.pattern);

  const langMaterial = jsonLang[`trim_material.minecraft.${material}`];
  const langPattern = jsonLang[`trim_pattern.minecraft.${pattern}`];

  lang[`trim_material.${material}`] = langMaterial;
  lang[`trim_pattern.${pattern}`] = langPattern;

  src?.push([langMaterial, shop, offer]);
  src?.push([langPattern, shop, offer]);

  return { material, pattern };
}

export async function convertLeatherColor(data) {
  const decode = decodeColor(data);

  let red = decode.red;
  let blue = decode.blue;
  let green = decode.green;

  const hexRed = red.toString(16).padStart(2, "0");
  const hexGreen = green.toString(16).padStart(2, "0");
  const hexBlue = blue.toString(16).padStart(2, "0");

  return `#${hexRed}${hexGreen}${hexBlue}`.toUpperCase();
}

export async function convertBannerPatterns(data, lang) {
  const banner = parse(data);

  const transformedBanner = banner.map(async (el) => {
    const color = el.color;
    const pattern = await replaceString(el.pattern);

    lang[`color.${color}`] = jsonLang[`color.minecraft.${color}`];

    return { color, pattern };
  });

  return await Promise.all(transformedBanner);
}

export async function convertCustomName(data) {
  const name = parse(data);
  let result = "";

  const applyStyles = (text, element) => {
    // Обработка числовых значений (value: 1/0)
    const bool = (val) => {
      if (typeof val === "object" && val !== null && "value" in val) return !!val.value;
      return !!val;
    };
    // Функция для обработки числовых или объектных значений и приведения их к логическому типу
    // - Если `val` — это объект и не равен `null`,
    //   а также имеет собственное свойство `value`, то:
    //       → Возвращаем логическое значение из `val.value` (через `!!`).
    // - Иначе:
    //       → Возвращаем логическое значение самого `val` (через `!!`).

    if (bool(element.obfuscated)) text = "#";
    if (bool(element.bold)) text = `<b>${text}</b>`;
    if (bool(element.italic)) text = `<i>${text}</i>`;
    if (bool(element.underlined)) text = `<u>${text}</u>`;
    if (bool(element.strikethrough)) text = `<s>${text}</s>`;

    if (element.color) {
      const hex = ConvertColorToHex(element.color);
      text = `<span style="color:${hex}">${text}</span>`;
    }

    return text;
  };

  if (name.text) {
    result += applyStyles(name.text, name);
  }

  if (Array.isArray(name.extra)) {
    for (const el of name.extra) {
      let text = typeof el === "string" ? el : el.text || "";
      result += applyStyles(text, el);
    }
  }

  return result;
}

export async function convertTranslateName(data) {
  const str = jsonLang[parse(data).translate];

  return `<span>${str}</span>`;
}

export async function convertLore(data) {
  const lore = parse(data);

  let newArray = [];
  lore.map(async (el) => newArray.push(await convertCustomName(stringify(el))));

  return newArray;
}

export async function convertShieldColor(data) {
  return parse(data);
}

export async function convertPotion(type, data, lang, shop, offer, src) {
  const potion = await replaceString(parse(data).potion);
  const id = await replaceString(type);

  const reg = id + "_" + potion;
  const translate = jsonLang[`item.minecraft.${id + ".effect." + potion}`];

  lang[reg] = translate;

  src?.push([translate, shop, offer]);

  if (potion.includes("long")) {
    lang[reg] = jsonLang[`item.minecraft.${id + ".effect." + potion.replace("long_", "")}`];
  }

  if (potion.includes("strong")) {
    lang[reg] = jsonLang[`item.minecraft.${id + ".effect." + potion.replace("strong_", "")}`];
  }

  return reg;
}

export async function convertContainer(data, lang, shop, offer, src) {
  const container = parse(data);

  const transformedContainer = container.map(async (el) => {
    const slot = el.slot.value;
    const item = await parseContainerStructure(el.item, lang, shop, offer, src);

    return { slot, ...item };
  });

  return await Promise.all(transformedContainer);
}

export async function convertBundle(data, lang, shop, offer, src) {
  const bundle = parse(data);

  const transformedBundle = bundle.map(async (el, i) => {
    return { pos: i, ...(await parseContainerStructure(el, lang, shop, offer, src)) };
  });

  return await Promise.all(transformedBundle);
}

export async function convertSuspiciousStew(data, lang, shop, offer, src) {
  const suspiciousStew = parse(data);

  const duration = suspiciousStew[0].duration.value;
  const effect = await replaceString(suspiciousStew[0].id);

  const langEffect = jsonLang[`effect.minecraft.${effect}`];

  lang[`suspicious_stew.${effect}`] = langEffect;

  src?.push([langEffect, shop, offer]);

  return { duration, effect };
}
