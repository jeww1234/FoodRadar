export default function initSwiper() {
  const element = document.querySelector('.custom-swiper');
  if (!element) return;

  new Swiper(element, {
    slidesPerView: 5,
    spaceBetween: 20,
    loop: true,
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'progressbar',
    },
    breakpoints: {
      1024: { slidesPerView: 5 },
      768: { slidesPerView: 3 },
      480: { slidesPerView: 2 },
    }
  });
}
