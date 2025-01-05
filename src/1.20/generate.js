export async function generate20(arg, lang, shop, offer, src) {
  return {
    id: "cobweb",
    minecraft_custom: '<span style="color: #CAEAF5">1.20.1 item</span>',
    lore: [
      '<span style="color: #405169">"Режим совместимости с этой"</span>',
      '<span style="color: #405169">версией майнкрафта, появится позже</span>',
    ],
    amount: arg.amount,
  };
}
