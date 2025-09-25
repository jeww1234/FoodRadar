// import axios from "axios";
// import fs from "fs";
// import dotenv from "dotenv";
// dotenv.config();    
// const key = process.env.api_key; // 국립중앙도서관 API 키 입력
// let abcd = [];

// // 검색 함수
// const searchBooks = async () => {
//   const kwd = document.getElementById("keyword").value.trim();
//   if (!kwd) {
//     alert("검색어를 입력하세요!");
//     return;
//   }

//   // 검색어를 URL 인코딩해서 API 호출
//   const url = new URL(`https://www.nl.go.kr/NL/search/openApi/search.do?key=${key}&srchTarget=total&kwd=${encodeURIComponent(kwd)}&pageNum=1&pageSize=10&category=도서&apiType=json`);
  
//   try {
//     const response = await fetch(url);
//     const sample = await response.json();
//     abcd = sample.result || [];

//     console.log("API 응답:", sample);
//     render(); // 데이터 다 받아온 후 렌더링
//   } catch (err) {
//     console.error("API 호출 에러:", err);
//     document.getElementById("exm").innerHTML = "<p>검색 중 오류가 발생했습니다.</p>";
//   }
// }

// // 출력 함수
// const render = () => {
//   // imageUrl이 존재하는 책만 추려내기
//   const filtered = abcd.filter(books => books.imageUrl && books.imageUrl.trim() !== "");

//   if (!filtered.length) {
//     document.getElementById("exm").innerHTML = "<p>이미지가 있는 검색 결과가 없습니다.</p>";
//     return;
//   }

//   const exmHTML = filtered.map(books => {
//     const imgUrl = `https://cover.nl.go.kr/${books.imageUrl}`;
//     return `
//       <div class="book-card" style="margin-bottom:20px;">
//         <h2>${books.titleInfo}</h2>
//         <div class="img-area">
//           <a href="${books.detailLink}" target="_blank">
//             <img src="${imgUrl}" alt="${books.titleInfo}" style="max-width:150px;">
//           </a>
//         </div>
//       </div>
//     `;
//   }).join("");

//   document.getElementById("exm").innerHTML = exmHTML;
// }