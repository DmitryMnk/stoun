const mainHeader = document.querySelector('.header');
const hiddenHeader = document.querySelector('.hidden-header');
const burgerButton = document.querySelector('.header__burger-button');
const burgerNav = document.querySelector('.header__burger-nav');
const stouneLinks = document.querySelectorAll('.stoune-link-clean')
const burgerNavLinks = document.querySelectorAll('.header__burger-nav-link')
let burgerAnimated = false;

document.addEventListener('DOMContentLoaded', () => {
    const hhWidth = hiddenHeader.clientWidth
    hiddenHeader.style.left = `calc(50% - ${hhWidth / 2}px)`
    if (window.scrollY > 150) {
        mainHeader.classList.add('header--off');
        hiddenHeader.classList.add('hidden-header--on');
    } else {
        hiddenHeader.classList.remove('hidden-header--on');
        mainHeader.classList.remove('header--off');
    }
})

document.addEventListener('scroll', () => {
    mainHeader.style.transition = 'transform 300ms ease-in-out, opacity 200ms ease-in-out';
    hiddenHeader.style.transition = 'transform 300ms ease-in-out, opacity 200ms ease-in-out';
    if (window.scrollY > 150 && !mainHeader.classList.contains('header--off')) {
        mainHeader.classList.toggle('header--off');
        setTimeout(() => {
            hiddenHeader.classList.toggle('hidden-header--on');
        }, 200)
    } else if (window.scrollY <= 150 && mainHeader.classList.contains('header--off')) {
        hiddenHeader.classList.toggle('hidden-header--on');
        setTimeout(() => {
            mainHeader.classList.toggle('header--off');
        }, 200)
    }
})

mainHeader.addEventListener('transitionend', () => {
    if (window.scrollY > 150) {
        mainHeader.classList.add('header--off');
        setTimeout(() => {
            hiddenHeader.classList.add('hidden-header--on');
        }, 200)
    } else {
        hiddenHeader.classList.remove('hidden-header--on');
        setTimeout(() => {
            mainHeader.classList.remove('header--off');
        }, 200)
    }
})

hiddenHeader.addEventListener('transitionend', () => {
    if (window.scrollY > 150) {
        mainHeader.classList.add('header--off');
        setTimeout(() => {
            hiddenHeader.classList.add('hidden-header--on');
        }, 200)
    } else {
        hiddenHeader.classList.remove('hidden-header--on');
        setTimeout(() => {
            mainHeader.classList.remove('header--off');
        }, 200)
    }
})

burgerButton.addEventListener('click', () => {
    if (!burgerAnimated) {
        burgerAnimated = true;
        burgerNav.style.transition = 'transform 300ms ease-in-out'
        burgerButton.classList.toggle('burger--active');
        burgerNav.classList.toggle('burger-nav--active');
        setTimeout(() => {
            burgerAnimated = false;
        }, 300)
    }
})

burgerNav.addEventListener('transitionend', () => {
    burgerNav.style.transition = ''
})

document.addEventListener('click', (e) => {
    if (burgerButton.classList.contains('burger--active') && !burgerNav.contains(e.target) && !burgerAnimated) {
        burgerAnimated = true;
        burgerNav.style.transition = 'transform 300ms ease-in-out'
        burgerButton.classList.toggle('burger--active');
        burgerNav.classList.toggle('burger-nav--active');
        setTimeout(() => {
            burgerAnimated = false;
        }, 300)
    }
})

burgerNavLinks.forEach(elem => elem.addEventListener(('click'), () => {
    if (burgerButton.classList.contains('burger--active')) {
        burgerAnimated = true;
        burgerNav.style.transition = 'transform 300ms ease-in-out'
        burgerButton.classList.toggle('burger--active');
        burgerNav.classList.toggle('burger-nav--active');
        setTimeout(() => {
            burgerAnimated = false;
        }, 300)
    }
}))

stouneLinks.forEach(elem => elem.addEventListener('click', () => {
    sessionStorage.removeItem('active_category');
}))