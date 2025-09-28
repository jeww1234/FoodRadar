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
  const res1 = await fetch("./db/item_img.json");
  const imgData = await res1.json();

  const res2 = await fetch("./db/DUR-medicine-data.json");
  const dur = await res2.json();

  medicineData = imgData.map((item) => ({
    id: item.SEQ,
    name: item.NAME,
  }));

  durData = dur.map((item) => ({
    id: item.ITEM_SEQ,
    name: item.ITEM_NAME,
    ingr: item.MIXTURE_MAIN_INGR || "",
  }));
}
loadData();

// 검색 실행
searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  const query = normalizeString(searchInput.value.trim());
  if (!query) {
    alert("검색어를 입력해주세요.");
    return;
  }

  const filtered = medicineData.filter((item) => normalizeString(item.name).includes(query));
  renderSearchList(filtered);
});

// 검색 결과 렌더링
function renderSearchList(list) {
  chkList.innerHTML = "";

  if (list.length === 0) {
    chkList.innerHTML = `<li><p>검색 결과가 없습니다</p></li>`;
    return;
  }

  list.forEach((item, idx) => {
    const uniqueId = `checkbox-${item.id}-${idx}`;
    const isChecked = store.some((m) => m.id === item.id) ? "checked" : "";

    chkList.innerHTML += `
      <li class="checkbox">
        <input type="checkbox" name="options" 
               id="${uniqueId}" 
               value="${item.id}" ${isChecked}/>
        <label class="checkbox__label" for="${uniqueId}">
          <span class="form-element__label">${item.name}</span>
          <span class="checkbox_faux"><i class="icon"></i></span>
        </label>
      </li>
    `;
  });

  list.forEach((item, idx) => {
    const input = document.getElementById(`checkbox-${item.id}-${idx}`);
    input.addEventListener("change", (e) => handleSelectMedicine(e, item));
  });
}

// 체크박스 선택 시 보관함 관리
function handleSelectMedicine(e, item) {
  if (e.target.checked) {
    if (store.length >= 2) {
      alert("보관함에는 최대 2개까지만 담을 수 있습니다.");
      e.target.checked = false;
      return;
    }
    store.push(item);
  } else {
    store = store.filter((m) => m.id !== item.id);
  }
  renderStore();
}

// 보관함 렌더링
function renderStore() {
  storeList.innerHTML = "";

  if (store.length === 0) {
    const li = document.createElement("li");
    li.innerHTML = `<p>선택된 약이 없습니다</p>`;
    storeList.appendChild(li);
    storeCheckedCount.textContent = "0개";
    return;
  }

  store.forEach((item) => {
    const li = document.createElement("li");
    li.classList.add("store-item");
    li.innerHTML = `
      <p>${item.name}</p>
      <button class="delete-btn" onclick="handleDelete('${item.id}')">
      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
      </button>
    `;
    storeList.appendChild(li);
  });

  storeCheckedCount.textContent = `${store.length}개`;
}

// 보관함에서 약 삭제
window.handleDelete = (id) => {
  if (store.length === 0) return;

  const confirmDelete = confirm("정말 삭제하시겠습니까?");
  if (!confirmDelete) return;

  store = store.filter((item) => item.id !== id);
  renderStore();

  const checkboxes = document.querySelectorAll(".checkbox input");
  checkboxes.forEach((input) => {
    if (input.value === id) {
      input.checked = false;
    }
  });
};

// 결과보기 버튼 클릭 → 병용금기 검사
openBtn.addEventListener("click", () => {
  if (store.length !== 2) {
    alert("비교하려면 보관함에 약을 2개 담아주세요.");
    popup.style.display = "none";
    return;
  }

  const isContraindicated = checkContraindication(store);

  if (isContraindicated) {
    popup.classList.remove("success");
    popup.classList.add("error");
    popupTitle.textContent = "불가능";
    popupImg.src = "./assets/images/temp/error_dur.png";
  } else {
    popup.classList.remove("error");
    popup.classList.add("success");
    popupTitle.textContent = "가능";
    popupImg.src = "./assets/images/temp/success_dur.png";
  }

  popup.style.display = "flex";
});

// 병용금기 검사
function checkContraindication(storeItems) {
  const durItems = storeItems.map((item) => durData.find((d) => d.id === item.id)).filter(Boolean);

  if (durItems.length === 0) return false;

  for (const durItem of durItems) {
    const cleanedIngr = normalizeString(durItem.ingr.replace(/\[[^\]]*\]/g, ""));
    const otherMedName = normalizeString(storeItems.find((m) => m.id !== durItem.id).name);

    if (otherMedName.includes(cleanedIngr)) {
      return true;
    }
  }

  return false;
}

// 팝업 닫기
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});
