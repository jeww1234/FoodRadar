const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs");

require("dotenv").config(); // 꼭 최상단에

const api_key = process.env.api_key;


const encodedKey = encodeURIComponent(api_key);
const totalPages = 249;
const allItems2 = [];

const fetchDurPage = async (page) => {
  const url = `https://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService02/getMdcinGrnIdntfcInfoList02?serviceKey=${encodedKey}&type=json&numOfRows=100&pageNo=${page}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.body?.items || [];
};

const run = async () => {
  for (let page = 1; page <= totalPages; page++) {
    console.log(`📦 Fetching page ${page}/${totalPages}`);
    const items = await fetchDurPage(page);
    const filtered = items.map((item) => ({
      SEQ: item.ITEM_SEQ,
      IMG: item.ITEM_IMAGE,
      NAME: item.ITEM_NAME,
    }));

    allItems2.push(...filtered);
    await new Promise((r) => setTimeout(r, 300));
  }

  fs.writeFileSync(
    "item_img.json",
    JSON.stringify(allItems2, null, 2),
    "utf-8"
  );
  console.log(`✅ 저장 완료: ${allItems2.length}개 항목`);
};

run();
