import convert from "color-convert";

import jsonLang from "../../lang.json" assert { type: "json" };

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

function ConvertColorToHex(color) {
  if (colorNames[color]) {
    const [r, g, b] = colorNames[color];
    const hex = convert.rgb.hex([r, g, b]);

    return `#${hex}`;
  }

  return color;
}

function decodeColor(color) {
  return {
    red: (color >> 16) & 255,
    green: (color >> 8) & 255,
    blue: color & 255,
  };
}

export function MinecraftId(id, lang, shop, offer, src) {
  const translate = jsonLang[`block.minecraft.${id}`] || jsonLang[`item.minecraft.${id}`];
  const records = jsonLang[`item.minecraft.${id}.desc`];

  lang[id] = translate;
  lang[`${id}.desc`] = records;

  src?.push([translate, shop, offer]);
  src?.push([records, shop, offer]);

  if (id.includes("netherite_upgrade")) {
    const netherite = jsonLang[`upgrade.minecraft.netherite_upgrade`];

    lang[`upgrade.${id}`] = netherite;
    src?.push([netherite, shop, offer]);
  }

  if (id.includes("smithing_template")) {
    const template = jsonLang[`trim_pattern.minecraft.${id.split("_")[0]}`];

    lang[`template.${id}`] = template;
    src?.push([template, shop, offer]);
  }

  return id;
}

export function CustomDisplayName(str) {
  let name = "";

  if (str === '{"translate":"block.minecraft.ominous_banner","color":"gold"}') {
    const translate = jsonLang["block.minecraft.ominous_banner"];

    name = JSON.stringify({
      text: "",
      extra: [
        {
          text: translate,
          obfuscated: false,
          italic: false,
          underlined: false,
          strikethrough: false,
          color: "gold",
          bold: false,
        },
      ],
    });
  } else {
    name = str;
  }

  if (name) {
    const data = JSON.parse(name);
    let result = "";

    if (data.extra && Array.isArray(data.extra)) {
      data.extra.forEach((element) => {
        if (element.text) {
          let text = element.text;

          if (element["bold"]) {
            text = `<b>${text}</b>`;
          }
          if (element["italic"]) {
            text = `<i>${text}</i>`;
          }
          if (element["underlined"]) {
            text = `<u>${text}</u>`;
          }
          if (element["strikethrough"]) {
            text = `<s>${text}</s>`;
          }
          if (element["obfuscated"]) {
            text = "#";
          }

          if (element.color) {
            const hexColor = ConvertColorToHex(element.color);
            text = `<span style="color: ${hexColor}">${text}</span>`;
          }

          result += text;
        }
      });
    }

    return result;
  } else {
    return "";
  }
}

export function LoreFormat(data) {
  let arr = [];
  data.map((el) => arr.push(CustomDisplayName(el)));

  return arr;
}

export function TransformEnchant(type, enchant, lang, shop, offer, src) {
  return Object.keys(enchant).map((key) => {
    const id = key.split(":")[1];
    const lvl = type === "shulker" ? enchant[key].value : enchant[key];

    const translate = jsonLang[`enchantment.minecraft.${id}`];

    lang[`enchantment.${id}`] = translate;
    lang[`enchantment.level.${lvl}`] = jsonLang[`enchantment.level.${lvl}`];

    src?.push([translate, shop, offer]);

    return { id, lvl };
  });
}

export function Instrument(instrument, lang) {
  lang[`goat_horn.${instrument}`] = jsonLang[`instrument.minecraft.${instrument}`];

  return instrument;
}

export function Trim(type, trim, lang) {
  let material;
  let pattern;

  if (type === "shulker") {
    material = trim.material.value.split(":")[1].toLowerCase();
    pattern = trim.pattern.value.split(":")[1].toLowerCase();
  } else {
    material = trim.material.split(":")[1].toLowerCase();
    pattern = trim.pattern.split(":")[1].toLowerCase();
  }

  lang[`trim_material.${material}`] = jsonLang[`trim_material.minecraft.${material}`];
  lang[`trim_pattern.${pattern}`] = jsonLang[`trim_pattern.minecraft.${pattern}`];

  return {
    material: material,
    pattern: pattern,
  };
}

export function LeatherColor(type, color) {
  let red;
  let blue;
  let green;

  if (type === "shulker") {
    const decode = decodeColor(color);
    red = decode.red;
    blue = decode.blue;
    green = decode.green;
  } else {
    red = color.RED;
    blue = color.BLUE;
    green = color.GREEN;
  }
  const hexRed = red.toString(16).padStart(2, "0");
  const hexGreen = green.toString(16).padStart(2, "0");
  const hexBlue = blue.toString(16).padStart(2, "0");

  return `#${hexRed}${hexGreen}${hexBlue}`;
}

export function ShieldColor(color, lang) {
  lang[`color.${color.toLowerCase()}`] = jsonLang[`color.minecraft.${color.toLowerCase()}`];

  return color.toLowerCase();
}

export function BannerPattern(type, list, lang) {
  return list.map((single) => {
    const color = type === "shulker" ? single.color.value.toLowerCase() : single.color.toLowerCase();
    const pattern =
      type === "shulker"
        ? single.pattern.value.split(":")[1].toLowerCase()
        : single.pattern.split(":")[1].toLowerCase();

    lang[`color.${color}`] = jsonLang[`color.minecraft.${color}`];

    return {
      color: color,
      pattern: pattern,
    };
  });
}

export function PotionEffect(effect, id, lang, shop, offer, src) {
  const reg = id + "_" + effect;
  const translate = jsonLang[`item.minecraft.${id + ".effect." + effect}`];

  lang[reg] = translate;

  src?.push([translate, shop, offer]);

  if (effect.includes("long")) {
    lang[reg] = jsonLang[`item.minecraft.${id + ".effect." + effect.replace("long_", "")}`];
  }

  if (effect.includes("strong")) {
    lang[reg] = jsonLang[`item.minecraft.${id + ".effect." + effect.replace("strong_", "")}`];
  }

  return reg;
}

// export function BookFormat(data) {
//   let arr = [];
//
//   data.map((el) => {
//     const single = JSON.parse(el);
//
//     if (typeof single === "string") {
//       arr.push(...single.split("\n"));
//     } else {
//       const res = CustomDisplayName(el);
//       arr.push(res);
//     }
//   });
//
//   return [...arr];
// }
//
// export function BookFormatShulker(list) {
//   let arr = [];
//
//   list.map((el) => {
//     const single = JSON.parse(el.raw.value);
//
//     if (typeof single === "string") {
//       arr.push(...single.split("\n"));
//     } else {
//       const res = CustomDisplayName(el.raw.value);
//       arr.push(res);
//     }
//   });
//
//   return [...arr];
// }
