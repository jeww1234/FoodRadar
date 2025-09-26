// let serverItems = [];
//       let allItems = [];

//       fetch("medicine-product-img.json")
//         .then((res) => res.json())
//         .then((data) => {
//           console.log("제이슨 서버", data);
//           serverItems = data.item1;
//           allItems = data.item2;
//           console.log(serverItems);
//           console.log(allItems);
//         });

//       const userInput = document.getElementById("userInput");
//       const addButton = document.getElementById("addButton");
//       const resultArea = document.getElementById("resultArea");
//       const listArea = document.getElementById("listArea");
//       const itemImgArea = document.getElementById("itemImgArea");

//       const searchItem = () => {
//         console.log(userInput.value);
//         const inputValue = userInput.value.trim();

//         const matcheditem = serverItems.filter((item) =>
//           item.ITEM_NAME.includes(inputValue)
//         );
//         console.log("matcheditem", matcheditem);
//         if (matcheditem.length > 0) {
//           listArea.innerHTML = "";
//           matcheditem.forEach((item) => {
//             const p = document.createElement("p");
//             p.textContent = item.ITEM_NAME;
//             p.style.cursor = "pointer";
//             p.addEventListener("click", () => {
//               resultArea.innerHTML = `<p><strong>ITEM_NAME:</strong> ${item.ITEM_NAME}</p>
//               <p><strong>EFCY:</strong> ${item.EFCY}</p>
//               <p><strong>SEQ:</strong> ${item.SEQ}</p>
//               <p><strong>STORAGE:</strong> ${item.STORAGE}</p>
//               <p><strong>USAGE:</strong> ${item.USAGE}</p>
//               <p><strong>USEITEM:</strong> ${item.USEITEM}</p>
//           `;
//               console.log("item", item);
//               console.log("all", allItems.length);
//               const matchedImage = allItems.find(
//                 (img) => String(img.SEQ) === String(item.SEQ)
//               );
//               const imageUrl = matchedImage?.IMG;
//               console.log("matchedImage:", matchedImage);
//               console.log("이미지 URL:", imageUrl);

//               const imgTag = itemImgArea.querySelector("img");
//               if (imageUrl) {
//                 imgTag.src = imageUrl;
//                 imgTag.alt = item.ITEM_NAME;
//               } else {
//                 imgTag.src = "";
//                 imgTag.alt = "이미지 없음";
//               }
//             });
//             listArea.appendChild(p);
//           });
//         } else {
//           console.log("없음");
//           listArea.innerHTML = "<p>검색 결과 없음</p>";
//         }
//       };
//       addButton.addEventListener("click", searchItem);