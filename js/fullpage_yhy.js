export default function initFullpage() {
  const element = document.getElementById("fullpage");
  if (!element) return;

  new fullpage('#fullpage', {
    autoScrolling: true,
    navigation: true,
    navigationTooltips: ['홈', '검색', '비교', '도서'],
    showActiveTooltip: true,
    navigationPosition: 'right',

    onLeave: (origin, destination) => {
      const header = document.querySelector('.header');
      const footer = document.querySelector('.footer');
      const nav = document.querySelector('#fp-nav');

      // header
      // if (destination.index === 0) {
      //   header?.classList.remove('hidden');
      // } else {
      //   header?.classList.add('hidden');
      // }

      // footer
      if (destination.isLast) {
        footer?.classList.add('show');
      } else {
        footer?.classList.remove('show');
      }

      // Nav
      [...nav.classList].forEach(cls => {
        if (cls.startsWith('nav-section')) {
          nav.classList.remove(cls);
        }
      });

      // Add Class
      nav.classList.add(`nav-section${destination.index + 1}`);
    },
    
  });
}
