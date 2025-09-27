// 파일 시스템 모듈 불러오기 (JSON 파일 읽기/쓰기용)
const fs = require("fs");

// 효과 정보 JSON 파일 읽어서 객체로 파싱
const effectData = JSON.parse(fs.readFileSync("effect_data.json", "utf-8"));

// 이미지 정보 JSON 파일 읽어서 객체로 파싱
const imgData = JSON.parse(fs.readFileSync("item_img.json", "utf-8"));

// 두 데이터를 하나의 객체로 병합
const combined = {
  item1: effectData, // 제품 효능 정보
  item2: imgData,    // 제품 이미지 정보
};

// 병합된 데이터를 새로운 JSON 파일로 저장
fs.writeFileSync(
  "medicine-product-img.json",               // 저장할 파일명
  JSON.stringify(combined, null, 2),         // 보기 좋게 들여쓰기
  "utf-8"                                    // 인코딩 방식
);

// 저장 완료 메시지 출력 (항목 수 포함)
console.log(`✅ 저장 완료: item1(${effectData.length}), item2(${imgData.length})`);