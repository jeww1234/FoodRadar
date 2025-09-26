let serverItems = [];
let allItems = [];

fetch("./db/medicine-product-img.json")
  .then((res) => res.json())
  .then((data) => {
    console.log("제이슨 서버", data);
    serverItems = data.item1;
    allItems = data.item2;
    console.log(serverItems);
    console.log(allItems);
  });

const userInput = document.getElementById("ingredient-search");
const addButton = document.getElementById("productAddButton");
const resultArea = document.getElementById("productResultArea");
const listArea = document.getElementById("productListArea");
const itemImgArea = document.getElementById("productItemImgArea");

const searchItem = () => {
  console.log(userInput.value);
  const inputValue = userInput.value.trim();

  const matcheditem = serverItems.filter((item) =>
    item.ITEM_NAME.includes(inputValue)
  );
  console.log("matcheditem", matcheditem);
  if (matcheditem.length > 0) {
    listArea.innerHTML = "";
    matcheditem.forEach((item) => {
      const li = document.createElement("li");
      const p = document.createElement("p");
      p.textContent = item.ITEM_NAME;
      p.style.cursor = "pointer";
      p.addEventListener("click", () => {
        resultArea.innerHTML = `<tr><th>제품명</th><td>${item.ITEM_NAME}</td></tr>
              <tr><th>효능 효과</th><td>${item.EFCY}</td></tr>                            
              <tr><th>복용 방법</th><td>${item.USAGE}</td></tr>              
              <tr><th>저장 방법</th><td>${item.STORAGE}</td></tr>
          `;
        console.log("item", item);
        console.log("all", allItems.length);
        const matchedImage = allItems.find(
          (img) => String(img.SEQ) === String(item.SEQ)
        );
        const imageUrl = matchedImage?.IMG;
        console.log("matchedImage:", matchedImage);
        console.log("이미지 URL:", imageUrl);

        const imgTag = itemImgArea.querySelector("img");
        if (imageUrl) {
          imgTag.src = imageUrl;
          imgTag.alt = item.ITEM_NAME;
        } else {
          imgTag.src = "";
          imgTag.alt = "이미지 없음";
        }
      });
      li.appendChild(p);
      listArea.appendChild(li);
    });
  } else {
    console.log("없음");
    p.textContent = "검색 결과 없음";
    li.appendChild(p);
    listArea.appendChild(li);
  }
};
addButton.addEventListener("click", searchItem);
