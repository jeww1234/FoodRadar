// 서버에서 불러온 의약품 정보와 이미지 데이터를 저장할 배열
let serverItems = []; // 제품 정보 (효능, 복용법 등)
let allItems = []; // 이미지 정보 (SEQ 기반)

// JSON 데이터 파일을 비동기로 불러와서 파싱
fetch("./db/medicine-product-img.json")
  .then((res) => res.json())
  .then((data) => {
    console.log("제이슨 서버", data); // 전체 데이터 확인
    serverItems = data.item1; // 제품 정보 저장
    allItems = data.item2; // 이미지 정보 저장
    console.log(serverItems); // 제품 정보 확인
    console.log(allItems); // 이미지 정보 확인
  });

// DOM 요소 참조
const userInput = document.getElementById("ingredient-search"); // 검색 입력창
const addButton = document.getElementById("productAddButton"); // 검색 버튼
const resultArea = document.getElementById("productResultArea"); // 상세 정보 표시 영역
const listArea = document.getElementById("productListArea"); // 검색 결과 리스트 영역
const itemImgArea = document.getElementById("productItemImgArea"); // 이미지 표시 영역

// 검색 실행 함수
const searchItem = () => {
  console.log(userInput.value); // 입력값 확인
  const inputValue = userInput.value.trim(); // 공백 제거

  // 🔧 이전 결과 초기화
  resultArea.innerHTML = ""; // 상세 정보 초기화
  itemImgArea.querySelector("img").src = "./assets/images/temp/no-image.jpg"; // 기본 이미지 설정
  itemImgArea.querySelector("img").alt = "이미지 없음";
  listArea.innerHTML = ""; // 리스트 초기화

  // 제품명 기준으로 필터링
  const matcheditem = inputValue
    ? serverItems.filter((item) => item.ITEM_NAME.includes(inputValue))
    : [];
  console.log("matcheditem", matcheditem);

  // 검색 결과가 있을 경우
  if (matcheditem.length > 0) {
    matcheditem.forEach((item) => {
      const li = document.createElement("li"); // 리스트 항목 생성
      const p = document.createElement("p"); // 제품명 표시
      p.textContent = item.ITEM_NAME;
      p.style.cursor = "pointer";

      // 제품명 클릭 시 상세 정보 및 이미지 표시
      p.addEventListener("click", () => {
        // 이미지 정보 매칭 (SEQ 기준)
        const matchedImage = allItems.find(
          (img) => String(img.SEQ) === String(item.SEQ)
        );
        const imageUrl = matchedImage?.IMG;
        console.log("matchedImage:", matchedImage);
        console.log("이미지 URL:", imageUrl);

        const imgTag = itemImgArea.querySelector("img");

        // 이미지 로딩 성공 시 상세 정보 표시
        // 👉 이미지 로딩은 비동기이기 때문에 src 설정 후 바로 정보 출력하면 이미지보다 정보가 먼저 뜰 수 있음
        // 👉 따라서 onload 이벤트를 사용해 이미지가 화면에 완전히 표시된 후에 정보가 뜨도록 처리함

        imgTag.onload = () => {
          resultArea.innerHTML = `<tr><th>제품명</th><td>${item.ITEM_NAME}</td></tr>
              <tr><th>효능 효과</th><td>${item.EFCY}</td></tr>                            
              <tr><th>복용 방법</th><td>${item.USAGE}</td></tr>              
              <tr><th>저장 방법</th><td>${item.STORAGE}</td></tr>`;
        };

        // 이미지 로딩 실패 시 기본 이미지로 대체하고 정보 표시
        // 👉 이미지 경로가 잘못됐거나 없을 경우에도 정보는 항상 출력되도록 onerror에서 처리함
        // 👉 alt 텍스트를 "이미지 없음"으로 설정해 사용자에게 시각적 안내도 제공

        imgTag.onerror = () => {
          imgTag.alt = "이미지 없음";
          resultArea.innerHTML = `<tr><th>제품명</th><td>${item.ITEM_NAME}</td></tr>
              <tr><th>효능 효과</th><td>${item.EFCY}</td></tr>                            
              <tr><th>복용 방법</th><td>${item.USAGE}</td></tr>              
              <tr><th>저장 방법</th><td>${item.STORAGE}</td></tr>`;
        };

        // 이미지 경로 설정 (있으면 사용, 없으면 기본 이미지)
        imgTag.src = imageUrl || "./assets/images/temp/no-image.jpg";
        imgTag.alt = item.ITEM_NAME || "이미지 없음";

        console.log("item", item); // 선택된 제품 정보 확인
        console.log("all", allItems.length); // 전체 이미지 수 확인
      });

      li.appendChild(p); // 리스트에 제품명 추가
      listArea.appendChild(li); // 리스트 영역에 항목 추가
    });
  } else {
    // 검색 결과가 없을 경우
    console.log("없음");
    listArea.innerHTML = ""; // 리스트 초기화
    const li = document.createElement("li");
    const p = document.createElement("p");
    p.textContent = "검색 결과 없음";

    li.appendChild(p);
    listArea.appendChild(li);
  }
};

// 검색 버튼 클릭 시 실행
addButton.addEventListener("click", searchItem);

// 엔터 키 입력 시 검색 실행
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault(); // 폼 자동 제출 방지
    searchItem(); // 검색 실행!
  }
});
