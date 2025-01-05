import url from "url";
import { getShopkeepersOffers, getShopkeepersSearch } from "../RedisRequest.js";

export const offersHandler = async (req, res, id) => {
  const parsedUrl = url.parse(req.url, true);

  const { _limit, _page, _select, _search } = parsedUrl.query;
  const limit = parseInt(_limit) || 64;
  const page = parseInt(_page) || 1;

  const offers = await getShopkeepersOffers();
  const search = await getShopkeepersSearch();

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  let filteredOffers;

  if (_select) {
    const selectedIds = _select.split(",");
    if (selectedIds.length === 0 || (selectedIds.length === 1 && selectedIds[0] === "")) {
      filteredOffers = offers;
    } else {
      filteredOffers = offers.filter((offer) => selectedIds.includes(offer.shop_id));
    }
  } else {
    filteredOffers = offers;
  }

  let searchFilteredOffers;

  if (_search) {
    const searchOffers = () => {
      // Результирующий массив для найденных предложений
      let foundOffers = [];

      // Проходим по ключам объекта search
      for (const key in search) {
        // Проверяем, включается ли _search в ключ
        if (key.toLowerCase().includes(_search)) {
          // Получаем объект с uuid и массивом id
          const shopData = search[key];

          // Проходим по ключам этого объекта (uuid)
          for (const shopId in shopData) {
            // Получаем массив id
            const offerIds = shopData[shopId];

            // Ищем предложения в массиве offers
            filteredOffers.forEach((offer) => {
              // Сравниваем shop_id и id
              if (offer.shop_id === shopId && offerIds.includes(offer.id)) {
                foundOffers.push(offer);
              }
            });
          }
        }
      }

      return foundOffers;
    };

    searchFilteredOffers = searchOffers();
  } else {
    searchFilteredOffers = filteredOffers;
  }

  const paginatedOffers = searchFilteredOffers.slice(startIndex, endIndex);

  res.writeHead(200, { "Content-Type": "application/json", "Access-Control-Allow-Origin": id });
  res.end(JSON.stringify({ data: paginatedOffers, total: searchFilteredOffers.length }));
};
