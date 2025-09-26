// node-fetch를 동적으로 import하여 fetch 함수 정의 (ESM 환경 대응)
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// 파일 시스템 모듈 불러오기 (JSON 저장용)
const fs = require("fs");

// .env 파일에서 환경변수 로딩 (API 키 포함) — 반드시 최상단에서 실행
// const api_key 보다 아래에 두면 const api_key가 undefined 따라서 에러 발생
require("dotenv").config();

const api_key = process.env.api_key; // 환경변수에서 API 키 가져오기
const encodedKey = encodeURIComponent(api_key); // URL에 안전하게 넣기 위해 인코딩

const totalPages = 49; // API에서 제공하는 전체 페이지 수
const allItems3 = []; // 최종 결과를 담을 배열

// 특정 페이지의 데이터를 API로부터 가져오는 함수
const fetchDurPage = async (page) => {
  const url = `https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList?serviceKey=${encodedKey}&type=json&numOfRows=100&pageNo=${page}`;
  const res = await fetch(url); // API 요청
  const data = await res.json(); // JSON 파싱
  return data.body?.items || []; // 데이터가 없으면 빈 배열 반환
};

// 전체 페이지 순회하며 데이터 수집 및 저장
const run2 = async () => {
  for (let page = 1; page <= totalPages; page++) {
    console.log(`📦 Fetching page ${page}/${totalPages}`); // 진행 상황 출력

    const items = await fetchDurPage(page); // 페이지별 데이터 가져오기

    // 필요한 필드만 추출하여 새로운 객체 배열 생성
    const filtered = items.map((item) => ({
      ITEM_NAME: item.itemName, // 제품명
      EFCY: item.efcyQesitm, // 효능 효과
      USAGE: item.useMethodQesitm, // 복용 방법
      CAUTION: item.atpnQesitm, // 주의 사항
      STORAGE: item.depositMethodQesitm, // 저장 방법
      SEQ: item.itemSeq, // 고유 식별 번호
      USEITEM: item.useMethodQesitm, // 복용 방법 (중복 필드, 추후 정리 가능)
    }));

    allItems3.push(...filtered); // 결과 배열에 추가

    await new Promise((r) => setTimeout(r, 300)); // API 요청 간 딜레이 (300ms)
  }

  // 최종 결과를 JSON 파일로 저장
  fs.writeFileSync(
    "effect_data.json", // 저장 파일명
    JSON.stringify(allItems3, null, 2), // 보기 좋게 들여쓰기
    "utf-8"
  );

  console.log(`✅ 저장 완료: ${allItems3.length}개 항목`);
};

// 실행
run2();