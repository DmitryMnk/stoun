import {Swiper} from '../package/swiper-bundle.min.mjs'
import { photoSwitcher } from './portfolio_functions.js';

const swipers = document.querySelectorAll('.our-works-swiper');
const photos = document.querySelectorAll('.our-work-picture');
const screenWidth = screen.availWidth;
let slides = 3;

if (screenWidth <= 640) {
    slides = 2
}

new photoSwitcher(photos);

swipers.forEach(elem => {
    new Swiper(elem, {
        slidesPerView: slides,
        spaceBetween: 10,
        loop: true,
        freeMode: true,
        autoplay: {
            delay: 2500,
        }
    })
})