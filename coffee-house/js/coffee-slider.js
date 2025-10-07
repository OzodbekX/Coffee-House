document.addEventListener('DOMContentLoaded', () => {
    new Swiper('.coffee-slider__swiper', {
      loop: true,
      spaceBetween: 32,
      centeredSlides: true,
      slidesPerView: 1.2,
      grabCursor: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      },
    });
  });
  