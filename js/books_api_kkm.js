document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('books-area');
  if (!container) return;

  const CERT_KEY = "b7aa4a45b752f3922e351f3626281be53c87c1ca97b1cda9133e6e1f4839f3f9"; // 👉 국립중앙도서관 발급 키 입력
  const url = `https://www.nl.go.kr/seoji/SearchApi.do?cert_key=${CERT_KEY}&result_style=json&page_no=1&page_size=50&title=약`;

  // HTML 태그 제거 (검색 결과 title에 <span> 태그가 포함되는 경우 대비)
  function stripHtml(html) {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  }

  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log("API 응답:", data);

      if (!data.docs || !Array.isArray(data.docs)) {
        console.warn("docs 배열이 없습니다.");
        return;
      }

      // 이미지 있는 도서만 필터링, 최대 10개
      const seen = new Set();
      const filteredBooks = data.docs
        .filter(book => book.TITLE_URL) // 이미지 있는 도서
        .filter(book => {
          const title = stripHtml(book.TITLE);
          if (seen.has(title)) return false;
          seen.add(title);
          return true;
        })
        .slice(0, 10);

      // DOM 생성
      container.innerHTML = filteredBooks.map(d => {
        const cleanTitle = stripHtml(d.TITLE);
        return `
          <article class="swiper-slide">
            <figure class="card">
              <div class="thumb">
                <img src="${d.TITLE_URL}" alt="${cleanTitle}">
              </div>
              <figcaption class="card-title">${cleanTitle}</figcaption>
            </figure>
          </article>
        `;
      }).join('');
    })
    .catch(err => console.error("API 호출 실패:", err));
});