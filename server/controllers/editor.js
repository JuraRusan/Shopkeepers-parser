import {
  getItemEditAllItems,
  getItemEditBanners,
  getItemEditBannersPatterns,
  getItemEditColors,
  getItemEditEnchantments,
  getItemEditMaterials,
  getItemEditPatterns,
  getItemEditShields,
} from "../RedisRequest.js";

export const editorHandler = async (req, res, id) => {
  const enchantments = await getItemEditEnchantments();
  const colors = await getItemEditColors();
  const patterns = await getItemEditPatterns();
  const materials = await getItemEditMaterials();
  const banners = await getItemEditBanners();
  const banners_patterns = await getItemEditBannersPatterns();
  const shield = await getItemEditShields();
  const all = await getItemEditAllItems();

  res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": id });
  res.end(
    JSON.stringify({
      data: {
        enchantments: enchantments,
        colors: colors,
        patterns: patterns,
        materials: materials,
        banners: banners,
        banners_patterns: banners_patterns,
        shield: shield,
        items: all,
      },
    })
  );
};
