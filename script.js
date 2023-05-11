'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height;
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
const lazyImages = document.querySelectorAll('img[data-src]');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let [i, el] of btnsOpenModal.entries())
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// Add smooth scroll to link
btnScrollTo.addEventListener('click', e => {
  // Old School Way
  // const s1coords = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  // Modern Way
  section1.scrollIntoView({ behavior: 'smooth' });
});

// Add smooth scroll on navigation links
document.querySelector('.nav__links').addEventListener('click', e => {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const link = e.target.getAttribute('href');
    document.querySelector(link).scrollIntoView({ behavior: 'smooth' });
  }
});

// Add tabbed component
tabContainer.addEventListener('click', e => {
  // Select clicked tab
  const clickedTab = e.target.closest('.operations__tab');

  // Guard Clause
  if (!clickedTab) return;

  // Remove active state from elements
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(tc => tc.classList.remove('operations__content--active'));

  // Activate tab
  clickedTab.classList.add('operations__tab--active');

  // Activate tab content
  document
    .querySelector(`.operations__content--${clickedTab.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Add menu hover animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(s => {
      if (s !== link) s.style.opacity = this;
    });

    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// Make navigation sticky on scroll

// const obsCallback = (entries, observer) => {
//   entries.forEach(entry => console.log(entry));
// };

// const obsOptions = {
//   root: null,
//   threshold: 0.2,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);

const stickyNav = entries => {
  const [entry] = entries; // get first entry of entries
  !entry.isIntersecting
    ? nav.classList.add('sticky')
    : nav.classList.remove('sticky');
};

const obsOptions = {
  root: null, // viewport (null)
  threshold: 0, // % of intersection
  rootMargin: `-${navHeight}px`, // box to apply outside of target
};

const headerObserver = new IntersectionObserver(stickyNav, obsOptions);
headerObserver.observe(header);

// Reveal Sections

const revealSection = entries => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');

  sectionObserver.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
});

// Lazy Load Images

const loadImg = entries => {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  // Wait for src to change then remove class
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  });

  imgObserver.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});

lazyImages.forEach(img => imgObserver.observe(img));

// Add Slider
const slider = () => {
  const dotContainer = document.querySelector('.dots');
  const slides = document.querySelectorAll('.slide');
  const btnRight = document.querySelector('.slider__btn--right');
  const btnLeft = document.querySelector('.slider__btn--left');

  let curIndex = 0;
  const maxLength = slides.length - 1;

  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>"`
      );
    });
  };
  createDots();

  const updateDots = index => {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${index}"]`)
      .classList.add('dots__dot--active');
  };
  updateDots(curIndex);

  const updateSlider = index => {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - index)}%)`;
    });
  };
  updateSlider(curIndex);

  const nextSlide = () => {
    curIndex === maxLength ? (curIndex = 0) : curIndex++;
    updateSlider(curIndex);
    updateDots(curIndex);
  };

  const prevSlide = () => {
    curIndex === 0 ? (curIndex = maxLength) : curIndex--;
    updateSlider(curIndex);
    updateDots(curIndex);
  };

  btnRight.addEventListener('click', nextSlide);

  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', e => {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  });

  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const slide = e.target.dataset.slide;

      updateSlider(slide);
      updateDots(slide);
    }
  });
};
slider();
