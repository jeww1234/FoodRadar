const fs = require("fs");

const effectData = JSON.parse(fs.readFileSync("effect_data.json", "utf-8"));
const imgData = JSON.parse(fs.readFileSync("item_img.json", "utf-8"));

const combined = {
  item1: effectData,
  item2: imgData,
};

fs.writeFileSync("medicine-product-img.json", JSON.stringify(combined, null, 2), "utf-8");
console.log(`✅ 저장 완료: item1(${effectData.length}), item2(${imgData.length})`);