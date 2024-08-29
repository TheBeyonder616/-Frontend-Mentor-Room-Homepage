"use strict";
//#region start
const header = document.getElementById("header");
const sliders = document.querySelectorAll("[data-slide]");
const sliderArticle = document.querySelectorAll("[data-slide-article]");
const section = document.querySelectorAll("[data-control]");
const nav = document.querySelector("[data-nav]");
const navMenu = document.querySelector("[data-menu-nav]");
const navList = document.querySelector("[data-nav-list]");
const navOverlay = document.querySelector("[data-overlay]");
const img = document.querySelectorAll("[data-lazy-img]");
const picture = document.querySelectorAll("[data-lazy-picture]");
//#region end

// #region start============================{Slider}==================
let currentSlider = 0;
let currentArticle = 0;

const handleUpdateSlide = function (slider, currentIndex) {
  slider.forEach((slide, index) => {
    slide.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
  });
};
const handleUpdateDot = (dots, currentIndex) => {
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
};

const changeSlide = function (direction, type) {
  //upadte slider
  if (type === "slider") {
    // Change depending on the direction
    currentSlider =
      direction === "prev"
        ? (currentSlider =
            currentSlider > 0 ? currentSlider - 1 : sliders.length - 1)
        : (currentSlider =
            currentSlider < sliders.length - 1 ? currentSlider + 1 : 0);

    handleUpdateSlide(sliders, currentSlider); //updated
    handleUpdateDot(section, currentSlider);
  } else if (type === "article") {
    //update article
    currentSlider =
      direction === "prev"
        ? (currentArticle =
            currentArticle > 0 ? currentArticle - 1 : sliderArticle.length - 1)
        : (currentArticle =
            currentArticle < sliderArticle.length - 1 ? currentArticle + 1 : 0);
    handleUpdateSlide(sliderArticle, currentArticle);
    handleUpdateDot(section, currentArticle);
  }
};

const initDot = function (dots, slider) {
  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = parseInt(dot.getAttribute("data-control"), 10);
      if (slider === sliders) {
        currentSlider = index;
      } else if (slider === sliderArticle) {
        currentArticle = index;
      }
      handleUpdateSlide(slider, currentSlider);
      handleUpdateSlide(sliderArticle, currentArticle);
      handleUpdateDot(dots, index);
    });
  });
};

//#region end

//#region start Helpers
const cList = {
  add: (e, cl) => e.classList.add(cl),
  rem: (e, cl) => e.classList.remove(cl),
  tog: (e, cl) => e.classList.toggle(cl),
};

const sTime = (func, time) => {
  setTimeout(() => {
    func();
  }, time);
};

const navIsOpen = () => {
  cList.rem(nav, "hide");
  sTime(() => {
    cList.rem(navMenu, "translateX");
    cList.rem(navOverlay, "translateX");
    cList.rem(navList, "hidden");
  }, 600);
};
const navIsClosed = () => {
  cList.add(navMenu, "translateX");
  cList.add(navOverlay, "translateX");
  cList.add(navList, "hidden");
  sTime(() => cList.add(nav, "hide"), 600);
};

const goRight = () => {
  changeSlide("next", "slider");
  changeSlide("next", "article");
};
const goLeft = () => {
  changeSlide("prev", "slider");
  changeSlide("prev", "article");
};
//#region end

//#region start lazy loading
// Images
const handleImgLazyL = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const img = entry.target;
    img.src = img.dataset.src;

    //When the image is done loading
    img.addEventListener("load", () => {
      const parent = img.parentNode;
      cList.rem(img, "lazy-img");
      cList.rem(parent, "lazy-img--container");
    });
    observer.unobserve(img);
  });
};

//picture
const handlePicLazyL = function (entries, observer) {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const picture = entry.target;

    // Chage the src
    const source = picture.querySelectorAll("source");
    source.forEach((source) => {
      const srcSet = source.dataset.srcset;

      if (source) {
        source.srcset = srcSet;
      }
    });

    // Change the Image src
    const img = picture.querySelector("img");
    const imgScr = img.dataset.src;

    if (img) {
      img.src = imgScr;
      img.addEventListener("load", () => {
        cList.rem(img, "lazy-img");
        cList.rem(picture, "lazy-img--container");
      });
    }

    observer.unobserve(picture);
  });
};

const options = {
  root: null,
  threshold: 0,
};

//Images
const lazyImageObserver = new IntersectionObserver(handleImgLazyL, options);
img.forEach((img) => lazyImageObserver.observe(img));

//Pictures
const lazyPictureObserver = new IntersectionObserver(handlePicLazyL, options);
picture.forEach((pic) => lazyPictureObserver.observe(pic));
//Pictures

//#region end

//#region start
header.addEventListener("click", function (e) {
  const btnright = e.target.closest("[data-mobile-right]");
  const btnleft = e.target.closest("[data-mobile-left]");
  const openMenu = e.target.closest("[data-open-nav]");
  const closeMenu = e.target.closest("[data-close-nav]");
  const overlayMenu = e.target.closest("[data-overlay]");
  const navItem = e.target.closest("[data-nav-item]");

  //   Slider Mobile
  if (btnright) goRight();
  if (btnleft) goLeft();
  // Slider Desktop
  //   Navigation
  if (openMenu) navIsOpen();
  if (closeMenu || overlayMenu || navItem) navIsClosed();
});

//#region end
document.addEventListener("DOMContentLoaded", function () {
  initDot(section, sliders);
  initDot(section, sliderArticle);
  handleUpdateSlide(sliders, currentSlider);
  handleUpdateSlide(sliderArticle, currentArticle);
});
