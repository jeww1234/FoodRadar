const searchInput = document.getElementById("compare-search");
const searchButton = document.getElementById("dur-searchButton");
const chkList = document.querySelector(".chk-list");
const storeList = document.getElementById("storeCheckedList");
const storeCheckedCount = document.getElementById("storeCheckedCount");
const openBtn = document.getElementById("openBtn");

const popup = document.getElementById("popup");
const popupTitle = popup.querySelector(".popup-title strong");
const popupImg = popup.querySelector(".popup-img img");
const closeBtn = document.getElementById("closeBtn");

let medicineData = [];
let durData = [];
let store = [];

// 문자열 정규화 (공백, 특수문자 제거 및 소문자 변환)
function normalizeString(str) {
  return str.replace(/[\s\[\]\/\-()]/g, "").toLowerCase();
}

// JSON 불러오기
async function loadData() {
  // 낱알 정보 API 데이터
  const res1 = await fetch("./db/item_img.json");
  const imgData = await res1.json();

  // DUR 병용금기 품목 API 데이터
  const res2 = await fetch("./db/DUR-medicine-data.json");
  const dur = await res2.json();

  // 낱알 정보 API 데이터에서 가져올 데이터 값
  medicineData = imgData.map((item) => ({
    id: item.SEQ, // 고유 ID == DUR ITEM_SEQ
    name: item.NAME, // 제품명
  }));

  // DUR 병용금기 품목 API 데이터에서 가져올 데이터 값
  durData = dur.map((item) => ({
    id: item.ITEM_SEQ, // 고유 ID == 낱알 정보 API SEQ
    name: item.ITEM_NAME, // 제품명
    ingr: item.MIXTURE_MAIN_INGR || "", // 병용금기 주성분
  }));
}
loadData();

// 검색 실행
searchButton.addEventListener("click", (e) => {
  // 기본 이벤트 제거
  e.preventDefault();
  const query = normalizeString(searchInput.value.trim()); // 공백 제거 및 정규화
  if (!query) {
    alert("검색어를 입력해주세요.");
    return;
  }

  // 정규화된 문자열 기준 필터링 해서 검색하기
  const filtered = medicineData.filter((item) => normalizeString(item.name).includes(query));
  renderSearchList(filtered);
});

// 검색 결과 렌더링
function renderSearchList(list) {
  // checkbox 리스트 초기화 하기
  chkList.innerHTML = "";

  // 만약 검색 결과가 없다면? 검색 결과 없음 return
  if (list.length === 0) {
    chkList.innerHTML = `<li><p>검색 결과가 없습니다</p></li>`;
    return;
  }

  // 검색 결과가 있다면? 체크박스 리스트 생성
  list.forEach((item, idx) => {
    // 각 체크 박스에 고유 id값 부여 : 이유? 병용금기 비교 후 다시 검색했을 때 체크박스 상태 유지하기 위함
    const uniqueId = `checkbox-${item.id}-${idx}`;
    // 체크박스 상태 유지(다른걸 검색하고 와도 체크된 상태 유지 시켜야 함)
    const isChecked = store.some((m) => m.id === item.id) ? "checked" : "";

    // 체크 후 보관함에 넣을 innerHTML
    chkList.innerHTML += `
      <li class="checkbox">
        <input type="checkbox" name="options" id="${uniqueId}" value="${uniqueId}" ${isChecked}/>
        <label class="checkbox__label" for="${uniqueId}">
          <span class="form-element__label">${item.name}</span>
          <span class="checkbox_faux">
            <i class="icon"></i>
          </span>
        </label>
      </li>
    `;
  });

  // 체크박스 이벤트 리스너 등록(isChecked 여부)
  list.forEach((item, idx) => {
    const input = document.getElementById(`checkbox-${item.id}-${idx}`);
    input.addEventListener("change", (e) => handleSelectMedicine(e, item));
  });
}

// 체크박스 선택 시 보관함 관리
function handleSelectMedicine(e, item) {
  // 체크박스 체크 여부에 따라 보관함에 추가/제거
  if (e.target.checked) {
    if (store.length >= 2) {
      // 2개까지만 비교
      alert("보관함에는 최대 2개까지만 담을 수 있습니다.");
      e.target.checked = false;
      return;
    }
    // 체크 시 보관함에 추가
    store.push(item);
  } else {
    // 체크 해제 시 보관함에서 제거
    store = store.filter((m) => m.id !== item.id);
  }
  // 완료 후 보관함으로 이동
  renderStore();
}

// 보관함 렌더링
function renderStore() {
  // 보관함 리스트 초기화
  storeList.innerHTML = "";

  // 보관함에 담긴 약이 없다면 안내 문구 표시
  if (store.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `<p>선택된 약이 없습니다</p>`;
    storeList.appendChild(li);

    storeCheckedCount.textContent = "0개";
    return;
  }

  // 보관함에 담긴 약이 있다면 리스트 생성
  store.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<p>${item.name}</p>`;
    storeList.appendChild(li);
  });

  // 보관함 수량 표시
  storeCheckedCount.textContent = `${store.length}개`;
}

// 결과보기 버튼 클릭 → 병용금기 검사
openBtn.addEventListener("click", () => {
  if (store.length !== 2) {
    alert("비교하려면 보관함에 약을 2개 담아주세요.");
    // 팝업 무조건 닫기
    popup.style.display = "none";
    return;
  }

  // 병용금기 검사
  const isContraindicated = checkContraindication(store);

  // 병용금기라면?
  if (isContraindicated) {
    popup.classList.remove("success");
    popup.classList.add("error");
    popupTitle.textContent = "불가능";
    popupImg.src = "./assets/images/temp/error_dur.png";
  }
  // 병용금기 아니라면?
  else {
    popup.classList.remove("error");
    popup.classList.add("success");
    popupTitle.textContent = "가능";
    popupImg.src = "./assets/images/temp/success_dur.png";
  }

  // 팝업 열기
  popup.style.display = "flex";
});

// 병용금기 검사
function checkContraindication(storeItems) {
  // DUR 데이터 있는 아이템만 추출
  const durItems = storeItems.map((item) => durData.find((d) => d.id === item.id)).filter(Boolean);

  // 둘 다 DUR 데이터에 없으면 병용금기 아님
  if (durItems.length === 0) return false;

  // 각 DUR 데이터에 대해 다른 보관함 약 이름 포함 여부 확인
  for (const durItem of durItems) {
    const cleanedIngr = normalizeString(durItem.ingr.replace(/\[[^\]]*\]/g, ""));
    const otherMedName = normalizeString(storeItems.find((m) => m.id !== durItem.id).name);

    if (otherMedName.includes(cleanedIngr)) {
      return true; // 병용금기
    }
  }

  return false; // 병용가능
}

// 팝업 닫기
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});
