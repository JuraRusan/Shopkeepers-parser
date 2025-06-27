import {
  convertBannerPatterns,
  convertBundle,
  convertContainer,
  convertCustomName,
  convertEnchantments,
  convertFirework,
  convertInstrument,
  convertLeatherColor,
  convertLore,
  convertPotion,
  convertShieldColor,
  convertSuspiciousStew,
  convertTranslateName,
  convertTrim,
  MinecraftId,
} from "./functions.js";
import { stringify } from "nbt-ts";

export async function parseYamlStructure(arg, lang, shop, offer, src) {
  return {
    id:
      arg.components && arg.components["minecraft:potion_contents"]
        ? await convertPotion(arg.id, arg.components["minecraft:potion_contents"], lang, shop, offer, src)
        : await MinecraftId(arg.id, lang, shop, offer, src),
    amount: arg.count,
    content:
      arg.components && arg.components["minecraft:container"]
        ? await convertContainer(arg.components["minecraft:container"], lang, shop, offer, src)
        : [],
    bundle:
      arg.components && arg.components["minecraft:bundle_contents"]
        ? await convertBundle(arg.components["minecraft:bundle_contents"], lang, shop, offer, src)
        : [],
    minecraft_custom:
      (arg.components && arg.components["minecraft:custom_name"]
        ? await convertCustomName(arg.components["minecraft:custom_name"])
        : undefined) ||
      (arg.components && arg.components["minecraft:item_name"]
        ? await convertTranslateName(arg.components["minecraft:item_name"])
        : undefined),
    lore:
      arg.components && arg.components["minecraft:lore"]
        ? await convertLore(arg.components["minecraft:lore"])
        : undefined,
    firework_power: arg.id.includes("firework_rocket")
      ? arg.components && arg.components["minecraft:fireworks"]
        ? await convertFirework(arg.components["minecraft:fireworks"])
        : 1
      : undefined,
    enchant:
      (arg.components && arg.components["minecraft:enchantments"]
        ? await convertEnchantments(arg.components["minecraft:enchantments"], lang, shop, offer, src)
        : undefined) ||
      (arg.components && arg.components["minecraft:stored_enchantments"]
        ? await convertEnchantments(arg.components["minecraft:stored_enchantments"], lang, shop, offer, src)
        : undefined),
    instrument:
      arg.components && arg.components["minecraft:instrument"]
        ? await convertInstrument(arg.components["minecraft:instrument"], lang, shop, offer, src)
        : undefined,
    trim:
      arg.components && arg.components["minecraft:trim"]
        ? await convertTrim(arg.components["minecraft:trim"], lang, shop, offer, src)
        : undefined,
    leather_color:
      arg.components && arg.components["minecraft:dyed_color"]
        ? await convertLeatherColor(arg.components["minecraft:dyed_color"])
        : undefined,
    shield:
      arg.components && arg.components["minecraft:base_color"]
        ? await convertShieldColor(arg.components["minecraft:base_color"], lang)
        : undefined,
    banner_pattern:
      arg.components && arg.components["minecraft:banner_patterns"]
        ? await convertBannerPatterns(arg.components["minecraft:banner_patterns"], lang)
        : undefined,
    suspicious:
      arg.components && arg.components["minecraft:suspicious_stew_effects"]
        ? await convertSuspiciousStew(arg.components["minecraft:suspicious_stew_effects"], lang, shop, offer, src)
        : undefined,
  };
}

export async function parseContainerStructure(arg, lang, shop, offer, src) {
  return {
    id:
      arg.components && arg.components["minecraft:potion_contents"]
        ? await convertPotion(arg.id, stringify(arg.components["minecraft:potion_contents"]), lang, shop, offer, src)
        : await MinecraftId(arg.id, lang, shop, offer, src),
    amount: arg.count.value,
    bundle:
      arg.components && arg.components["minecraft:bundle_contents"]
        ? await convertBundle(stringify(arg.components["minecraft:bundle_contents"]), lang, shop, offer, src)
        : [],
    minecraft_custom:
      (arg.components && arg.components["minecraft:custom_name"]
        ? await convertCustomName(stringify(arg.components["minecraft:custom_name"]))
        : undefined) ||
      (arg.components && arg.components["minecraft:item_name"]
        ? await convertTranslateName(stringify(arg.components["minecraft:item_name"]))
        : undefined),
    lore:
      arg.components && arg.components["minecraft:lore"]
        ? await convertLore(stringify(arg.components["minecraft:lore"]))
        : undefined,
    firework_power: arg.id.includes("firework_rocket")
      ? arg.components && arg.components["minecraft:fireworks"]
        ? await convertFirework(stringify(arg.components["minecraft:fireworks"]))
        : 1
      : undefined,
    enchant:
      (arg.components && arg.components["minecraft:enchantments"]
        ? await convertEnchantments(stringify(arg.components["minecraft:enchantments"]), lang, shop, offer, src)
        : undefined) ||
      (arg.components && arg.components["minecraft:stored_enchantments"]
        ? await convertEnchantments(stringify(arg.components["minecraft:stored_enchantments"]), lang, shop, offer, src)
        : undefined),
    instrument:
      arg.components && arg.components["minecraft:instrument"]
        ? await convertInstrument(stringify(arg.components["minecraft:instrument"]), lang, shop, offer, src)
        : undefined,
    trim:
      arg.components && arg.components["minecraft:trim"]
        ? await convertTrim(stringify(arg.components["minecraft:trim"]), lang, shop, offer, src)
        : undefined,
    leather_color:
      arg.components && arg.components["minecraft:dyed_color"]
        ? await convertLeatherColor(stringify(arg.components["minecraft:dyed_color"]))
        : undefined,
    shield:
      arg.components && arg.components["minecraft:base_color"]
        ? await convertShieldColor(stringify(arg.components["minecraft:base_color"]), lang)
        : undefined,
    banner_pattern:
      arg.components && arg.components["minecraft:banner_patterns"]
        ? await convertBannerPatterns(stringify(arg.components["minecraft:banner_patterns"]), lang)
        : undefined,
    suspicious:
      arg.components && arg.components["minecraft:suspicious_stew_effects"]
        ? await convertSuspiciousStew(
            stringify(arg.components["minecraft:suspicious_stew_effects"]),
            lang,
            shop,
            offer,
            src
          )
        : undefined,
  };
}
