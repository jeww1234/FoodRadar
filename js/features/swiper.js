export default function initSwiper() {
  // 관련도서
  const infoSwiper = document.querySelector('.custom-swiper');
  if (infoSwiper) {
    new Swiper(infoSwiper, {
      slidesPerView: 5,
      spaceBetween: 20,
      loop: true,
      navigation: {
        nextEl: '.section04 .swiper-button-next',
        prevEl: '.section04 .swiper-button-prev',
      },
      pagination: {
        el: '.section04 .swiper-pagination',
        type: 'progressbar',
      },
      breakpoints: {
        1024: { slidesPerView: 5 },
        768: { slidesPerView: 3 },
        480: { slidesPerView: 2 },
      }
    });
  }

  // Visual
  const visualSwiper = document.querySelector('.visual-swiper');
  if (visualSwiper) {
    new Swiper(visualSwiper, {
      slidesPerView: 1,
      loop: true,
      effect: 'fade', // 비주얼 느낌이면 fade 효과 추천
      speed: 1200,
      autoplay: {
        delay: 8000,
        disableOnInteraction: false,
      },
    });
  }
}
