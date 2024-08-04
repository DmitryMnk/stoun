import { 
    get_items, 
    set_bold, 
    set_thin,
    showCategories,
    hideCategories,
    autoscroll
} from "./catalog_functions.js";
const categories = document.querySelectorAll('.catalog-page__list-button');
const content = document.querySelector('.catalog-page__content');
const showCatsButton = document.querySelectorAll('.show-category-panel');
const categoriesPanel = document.querySelector('.catalog-page__panel');
const closeCategoriesPanelButton = document.querySelector('.catalog-page__close-panel-button');

let animated = false;

categories.forEach(elem => elem.addEventListener('click', () => {
    if (!elem.classList.contains('category-button--active') && !animated) {
        sessionStorage.setItem('active_category', elem.id)
        animated = true;
        const activeElem = document.querySelector('.category-button--active')
        activeElem.classList.remove('category-button--active');
        elem.classList.add('category-button--active')
        set_bold(elem)
        set_thin(activeElem)
        get_items(content, elem.id);
        setTimeout(()=> {
            animated = false
        }, 500)
        if (categoriesPanel.classList.contains('categories-panel--active')) {
            hideCategories(categoriesPanel)
        }
        autoscroll();
    }   
}))

document.addEventListener('DOMContentLoaded', () => {
    if (!sessionStorage.getItem('active_category')) {
        categories[0].classList.add('category-button--active');
        set_bold(categories[0])
        get_items(content, categories[0].id)
        return
    }

    const item_id = sessionStorage.getItem('active_category');
    const activeCat = document.getElementById(item_id);
    activeCat.classList.add('category-button--active');
    set_bold(activeCat);
    get_items(content, item_id)
})

showCatsButton.forEach(button => button.addEventListener('click', () => {
    if (!animated) {
        animated = true;
        showCategories(categoriesPanel);
        setTimeout(()=> {
            animated = false
        }, 220)
    }
}))

categoriesPanel.addEventListener('transitionend', () => {
    categoriesPanel.style.transition = '';
})

closeCategoriesPanelButton.addEventListener('click', () => {
    if (!animated) {
        animated = true;
        hideCategories(categoriesPanel);
        setTimeout(()=> {
            animated = false
        }, 220)
    }
})
