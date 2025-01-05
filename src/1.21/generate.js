import { Buffer } from "buffer";
import nbt from "nbt";
import {
  BannerPattern,
  CustomDisplayName,
  Instrument,
  LeatherColor,
  LoreFormat,
  MinecraftId,
  PotionEffect,
  ShieldColor,
  TransformEnchant,
  Trim,
} from "./functions.js";

async function parseInternal21(func, lang, shop, offer, src) {
  if (func.meta?.internal) {
    const base64Decoded = Buffer.from(func.meta.internal, "base64");

    return new Promise((resolve, reject) => {
      nbt.parse(base64Decoded, (error, data) => {
        if (error) {
          reject(error);
          return;
        }

        const items = data?.value?.["block-entity-components"]?.value?.["minecraft:container"]?.value?.value || [];

        const result = items.map((singleItem) => {
          const single = singleItem.item.value;

          const slot = singleItem.slot.value;
          const id = !single.components?.value?.["minecraft:potion_contents"]?.value
            ? MinecraftId(single.id.value.split(":")[1], lang, shop, offer, src)
            : PotionEffect(
                single.components.value["minecraft:potion_contents"].value.potion.value.split(":")[1],
                single.id.value.split(":")[1],
                lang,
                shop,
                offer,
                src
              );
          const amount = single.count.value;
          const minecraft_custom = !single.components?.value?.["minecraft:custom_name"]?.value
            ? undefined
            : CustomDisplayName(single.components.value["minecraft:custom_name"].value);
          const lore = !single.components?.value?.["minecraft:lore"]?.value?.value
            ? undefined
            : LoreFormat(single.components.value["minecraft:lore"].value.value);
          const firework_power =
            single.id.value.split(":")[1] === "firework_rocket"
              ? !single.components?.value?.["minecraft:fireworks"]?.value?.flight_duration?.value
                ? 1
                : single.components.value["minecraft:fireworks"].value.flight_duration.value
              : undefined;
          const enchant =
            (!single.components?.value?.["minecraft:enchantments"]?.value?.levels?.value
              ? undefined
              : TransformEnchant(
                  "shulker",
                  single.components.value["minecraft:enchantments"].value.levels.value,
                  lang,
                  shop,
                  offer,
                  src
                )) ||
            (!single.components?.value?.["minecraft:stored_enchantments"]?.value?.levels?.value
              ? undefined
              : TransformEnchant(
                  "shulker",
                  single.components.value["minecraft:stored_enchantments"].value.levels.value,
                  lang,
                  shop,
                  offer,
                  src
                ));
          const instrument = !single.components?.value?.["minecraft:instrument"]?.value
            ? undefined
            : Instrument(single.components.value["minecraft:instrument"].value.split(":")[1].toLowerCase(), lang);
          const trim = !single.components?.value?.["minecraft:trim"]?.value
            ? undefined
            : Trim("shulker", single.components.value["minecraft:trim"].value, lang);
          const leather_color = !single.components?.value?.["minecraft:dyed_color"]?.value
            ? undefined
            : LeatherColor("shulker", single.components.value["minecraft:dyed_color"].value.rgb.value);
          const shield = !single.components?.value?.["minecraft:base_color"]?.value
            ? undefined
            : ShieldColor(single.components.value["minecraft:base_color"].value, lang);
          const banner_pattern = !single.components?.value?.["minecraft:banner_patterns"]?.value?.value
            ? undefined
            : BannerPattern("shulker", single.components.value["minecraft:banner_patterns"].value.value, lang);
          // const book = {
          //   title: single.components?.value?.["minecraft:written_book_content"]?.value?.title?.value?.raw?.value,
          //   author: single.components?.value?.["minecraft:written_book_content"]?.value?.author?.value,
          //   pages: single.components?.value?.["minecraft:written_book_content"]?.value?.pages
          //     ? BookFormatShulker(single.components.value["minecraft:written_book_content"].value.pages.value.value)
          //     : undefined,
          // };

          return {
            slot,
            amount,
            id,
            minecraft_custom,
            lore,
            firework_power,
            enchant,
            instrument,
            trim,
            leather_color,
            shield,
            banner_pattern,
          };
        });

        resolve(result);
      });
    });
  }

  return [];
}

export async function generate21(arg, lang, shop, offer, src) {
  return {
    id:
      arg.meta?.["meta-type"] === "POTION"
        ? PotionEffect(arg.meta?.["potion-type"].split(":")[1], arg.type.toLowerCase(), lang, shop, offer, src)
        : MinecraftId(arg.type.toLowerCase(), lang, shop, offer, src),
    amount: arg.amount,
    content: await parseInternal21(arg, lang, shop, offer, src),
    minecraft_custom: !arg.meta?.["display-name"] ? undefined : CustomDisplayName(arg.meta["display-name"]),
    lore: !arg.meta?.lore ? undefined : LoreFormat(arg.meta.lore),
    firework_power:
      arg.type === "FIREWORK_ROCKET" ? (arg.meta?.["meta-type"] === "FIREWORK" ? arg.meta.power : 1) : undefined,
    enchant:
      (!arg.meta?.enchants ? undefined : TransformEnchant("default", arg.meta.enchants, lang, shop, offer, src)) ||
      (!arg.meta?.["stored-enchants"]
        ? undefined
        : TransformEnchant("default", arg.meta["stored-enchants"], lang, shop, offer, src)),
    instrument:
      arg.meta?.["meta-type"] === "MUSIC_INSTRUMENT"
        ? Instrument(arg.meta.instrument.split(":")[1].toLowerCase(), lang)
        : undefined,
    trim: !arg.meta?.trim ? undefined : Trim("default", arg.meta.trim, lang),
    leather_color: arg.meta?.["meta-type"] === "COLORABLE_ARMOR" ? LeatherColor("default", arg.meta.color) : undefined,
    shield: !arg.meta?.["base-color"] ? undefined : ShieldColor(arg.meta["base-color"], lang),
    banner_pattern: !arg.meta?.patterns ? undefined : BannerPattern("default", arg.meta.patterns, lang),
    // book:
    //   arg.meta?.["meta-type"] === "BOOK_SIGNED"
    //     ? {
    //         title: !arg.meta?.title ? undefined : arg.meta.title,
    //         author: !arg.meta?.author ? undefined : arg.meta.author,
    //         pages: !arg.meta?.pages ? undefined : BookFormat(arg.meta.pages),
    //       }
    //     : undefined,
  };
}
