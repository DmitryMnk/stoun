import {Swiper} from '../package/swiper-bundle.min.mjs'
import { Switcher } from "./switcher.js";
import { photoSwitcher } from './portfolio_functions.js';


const mySwiper = document.querySelector('.mySwiper')
const categotyCard = document.querySelectorAll('.category__card');
const switchers = document.querySelectorAll('.switcher');
const bannerButton = document.querySelector('.banner__button');
const mainModal = document.querySelector('.main-modal');
const modalCloseButton = document.querySelector('.main-modal__close-button');
const bannerSwiperNode = document.querySelector('.banner__slider')
const photos = document.querySelectorAll('.portfolio__card-img');
const photoCards = document.querySelectorAll('.portfolio__card');

const photosw = new photoSwitcher(photos)
photoCards.forEach(card => card.addEventListener('click', () => {
    const activeImg = card.querySelector('img')
    photosw.activate(activeImg)
}))

let windowPosition;
let animated = false;
let bodyPad = 0
const screenSize = screen.availWidth
let slides = 5

if (screenSize < 425) {
    slides = 1;
} else if (screenSize < 768) {
    slides = 3;
}

if (screenSize >= 1024) {
    bodyPad = 12;
}

categotyCard.forEach(elem => elem.addEventListener('click', () => {
    sessionStorage.setItem('active_category', elem.id);
    window.location = '/каталог'
}))

const catalogSwiper = new Swiper(mySwiper, {
    slidesPerView: slides,
    spaceBetween: 0,
    loop: true,
    freeMode: true,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
})

const bannerSwiper = new Swiper(bannerSwiperNode, {
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    autoplay: {
        delay: 4000,
    }
})

bannerButton.addEventListener('click', () => {
    if (!animated) {
        windowPosition = window.scrollY;
        animated = true;
        setTimeout(() => {
            animated = false;
        }, 220)

        if (!mainModal.classList.contains('main-modal--active')) {
            mainModal.style.display = 'flex';
            setTimeout(() => {
                mainModal.classList.add('main-modal--active');
            }, 20);
            
        } else {
    

            mainModal.classList.remove('main-modal--active');
            setTimeout(() => {
                mainModal.style.display = 'none';
            }, 200)
        }
    }
})

mainModal.addEventListener('click', (e) => {
    if (e.target == mainModal) {
        mainModal.classList.remove('main-modal--active');

        setTimeout(() => {
            mainModal.style.display = 'none';
        }, 200)
    }
})

modalCloseButton.addEventListener('click', () => {
    if (mainModal.classList.contains('main-modal--active')) {
        mainModal.classList.remove('main-modal--active');

        setTimeout(() => {
            mainModal.style.display = 'none';
        }, 200)
}
})

window.addEventListener('scroll', (e) => {
    if (mainModal.classList.contains('main-modal--active')) {
        window.scrollTo(0, windowPosition)
    }
})

switchers.forEach(switcher => new Switcher(switcher))