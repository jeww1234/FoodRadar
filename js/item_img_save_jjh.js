// node-fetch를 동적으로 import하여 fetch 함수 정의
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// 파일 시스템 모듈 불러오기
const fs = require("fs");

// .env 파일에서 환경변수 로딩 (API 키 포함) — 꼭 최상단에 위치해야 함
require("dotenv").config();

const api_key = process.env.api_key; // 환경변수에서 API 키 가져오기
const encodedKey = encodeURIComponent(api_key); // URL 인코딩 처리

/*
  🔍 왜 인코딩이 필요할까?
      API 키나 다른 파라미터 값에는 다음과 같은 특수 문자가 포함될 수 있어요:
      - +, =, &, /, %, ? 등
      이런 문자들은 URL에서 구분자 역할을 하기 때문에, 그대로 쓰면 브라우저나 서버가 잘못 해석할 수 있어요.
      
      https://example.com?key=abc+123&value=test
      
      이 URL에서 +는 공백으로 해석될 수 있고, &는 다음 파라미터의 시작으로 인식돼요. 그래서 API 키가 abc+123&      value=test라면, 서버는 key=abc 123과 value=test로 잘못 나눠버릴 수 있죠.
      ✅ 그래서 encodeURIComponent를 쓰면?
      이렇게 하면 API 키 안의 특수 문자들이 URL-safe 문자로 변환돼요. 예를 들어:
      - + → %2B
      - & → %26
      - = → %3D
      이렇게 바뀌면 서버가 정확하게 전체 문자열을 하나의 값으로 인식할 수 있어요.
 */

const totalPages = 249; // 전체 페이지 수 (API 기준)
const allItems2 = []; // 최종 결과를 담을 배열

// 특정 페이지의 데이터를 API로부터 가져오는 함수
const fetchDurPage = async (page) => {
  const url = `https://apis.data.go.kr/1471000/MdcinGrnIdntfcInfoService02/getMdcinGrnIdntfcInfoList02?serviceKey=${encodedKey}&type=json&numOfRows=100&pageNo=${page}`;
  const res = await fetch(url); // API 요청
  const data = await res.json(); // JSON 파싱
  return data.body?.items || []; // 데이터가 없으면 빈 배열 반환
};

// 전체 페이지 순회하며 데이터 수집 및 저장
const run = async () => {
  for (let page = 1; page <= totalPages; page++) {
    console.log(`📦 Fetching page ${page}/${totalPages}`); // 진행 상황 출력

    const items = await fetchDurPage(page); // 페이지별 데이터 가져오기

    // 필요한 필드만 추출하여 새로운 객체 배열 생성
    const filtered = items.map((item) => ({
      SEQ: item.ITEM_SEQ,
      IMG: item.ITEM_IMAGE,
      NAME: item.ITEM_NAME,
    }));

    allItems2.push(...filtered); // 결과 배열에 추가

    await new Promise((r) => setTimeout(r, 300)); // API 요청 간 딜레이 (300ms)
  }

  // 최종 결과를 JSON 파일로 저장
  fs.writeFileSync(
    "item_img.json",
    JSON.stringify(allItems2, null, 2), // 보기 좋게 들여쓰기
    "utf-8"
  );

  console.log(`✅ 저장 완료: ${allItems2.length}개 항목`);
};

// 실행
run();
