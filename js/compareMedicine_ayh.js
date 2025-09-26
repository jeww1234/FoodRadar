const searchInput = document.getElementById("compare-search");
const searchButton = document.getElementById("dur-searchButton");
const chkList = document.querySelector(".chk-list");
const selectedList = document.querySelector(".list.scroll");
const storeList = document.getElementById("storeCheckedList");
const storeCheckedCount = document.getElementById("storeCheckedCount");
const openBtn = document.getElementById("openBtn");

const popup = document.getElementById("popup");
const popupTitle = popup.querySelector(".popup-title strong");
const popupImg = popup.querySelector(".popup-img img");
const closeBtn = document.getElementById("closeBtn");

let medicineData = [];

// JSON 불러오기
fetch("./db/DUR-medicine-data.json")
  .then((res) => res.json())
  .then((data) => {
    medicineData = data;
  });

// 검색 버튼 클릭
searchButton.addEventListener("click", (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;

  const results = medicineData.filter((item) => item.ITEM_NAME.includes(query));

  chkList.innerHTML = "";

  results.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("checkbox");
    const inputId = `checkbox-${index}`;

    li.innerHTML = `
        <input type="checkbox" id="${inputId}" value="${item.ITEM_NAME}">
        <label class="checkbox__label" for="${inputId}">
          <span class="form-element__label">${item.ITEM_NAME}</span>
          <span class="checkbox_faux"><i class="icon"></i></span>
        </label>
      `;

    chkList.appendChild(li);

    // 체크박스 선택 이벤트
    li.querySelector("input").addEventListener("change", (ev) => {
      if (ev.target.checked) {
        if (selectedList.querySelectorAll("li").length >= 2) {
          alert("최대 2개까지만 선택할 수 있습니다.");
          ev.target.checked = false;
          return;
        }
        // 보관함에 체크된 아이템 추가
        const newLi = document.createElement("li");
        newLi.innerHTML = `<p>${item.ITEM_NAME}</p>`;
        storeList.appendChild(newLi);
      } else {
        const target = [...storeList.querySelectorAll("li")].find(
          (li) => li.textContent === item.ITEM_NAME
        );
        if (target) target.remove();
      }
      storeCheckedCount.textContent = storeList.querySelectorAll("li").length;
    });
  });
});

// 결과보기 버튼 클릭
openBtn.addEventListener("click", () => {
  const storeListItems = [...storeList.querySelectorAll("li")].map((li) => li.textContent.trim());

  if (storeListItems.length < 2) {
    alert("2개를 선택해 주세요.");
    return;
  }

  const selectedMixtures = storeListItems.map((itemName) => {
    const found = medicineData.find((med) => med.ITEM_NAME === itemName);
    return found ? found.MIXTURE_ITEM_NAME.replace(/\s+/g, "") : "";
  });

  const [mix1, mix2] = selectedMixtures;

  // 병용금기 판단
  if (mix1 && mix2 && (mix1.includes(mix2) || mix2.includes(mix1))) {
    // 불가능할경우
    popup.classList.remove("success");
    popup.classList.add("error");
    popupTitle.textContent = "불가능";
    popupImg.src = "./assets/images/temp/error_dur.png";
  } else {
    // 가능할경우
    popup.classList.remove("error");
    popup.classList.add("success");
    popupTitle.textContent = "가능";
    popupImg.src = "./assets/images/temp/success_dur.png";
  }

  popup.style.display = "block";
});

// 팝업 닫기
closeBtn.addEventListener("click", () => {
  popup.style.display = "none";
});
