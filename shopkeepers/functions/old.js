export async function parseOld(arg) {
  return {
    id: "cobweb",
    minecraft_custom: '<span style="color: #CAEAF5">Предмет из старой версии</span>',
    lore: [
      '<span style="color: #555555">Minecraft изменил формат данных, а после</span>',
      '<span style="color: #555555">так же изменилась и структура плагина.</span>',
      '<span style="color: #555555">Поддержка двух устаревших версий</span>',
      '<span style="color: #555555">вместе с актуальной слишком сложна,</span>',
      '<span style="color: #555555">поэтому оставлена только актуальная.</span>',
    ],
    amount: arg.amount,
  };
}
