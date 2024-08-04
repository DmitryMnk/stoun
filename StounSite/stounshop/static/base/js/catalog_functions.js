let load_images = 0
async function get_items(parentBlock, item_id) {
    const list = parentBlock.querySelector('.catalog-page__content-list');
    const listContainer = parentBlock.querySelector('.catalog-page__panel-list-container');
    const wrapper = parentBlock.querySelector('.catalog-page__content-wrapper');
    const title = parentBlock.querySelector('.catalog-page__content-title');
    const preloader = new Preloader(listContainer);
    list.style.opacity = 0;
    
    const item_pk = item_id.split('-')[1]
    preloader.activate();
    load_items(item_pk).then(response => {
        setTimeout(() => {
            title.style.opacity = '0';
            setTimeout(() => {
                title.textContent = response.category.toUpperCase();
            },300)
            setTimeout(() => {
                title.style.opacity = '1';
            },320)
            const amount = response.data.length
            list.innerHTML = '';
            for (const item of response.data) {
                createItemCard(item, response.category, list, wrapper, amount, preloader)
            }
            if (amount == 0) {
                preloader.close();
                list.style.opacity = 1;
                
            }
        }, 200)
  
    })
}

function createItemCard(itemData, category, list, wrapper, amount, preloader) {
    const newListItem = document.createElement('li');
    newListItem.classList.add('catalog-page__content-list-item')

    const newCard = document.createElement('div');
    newCard.classList.add('catalog-page__content-card');

    const cardImg = document.createElement('img');
    cardImg.src = itemData.image;
    cardImg.classList.add('catalog-page__content-card-image');

    const cardCategory = document.createElement('h4');
    cardCategory.textContent = category;
    cardCategory.classList.add('catalog-page__content-card-category', 'reset-text');

    const description = document.createElement('p');
    description.textContent = itemData.name;
    description.classList.add('catalog-page__content-card-description', 'reset-text');

    newCard.append(cardImg, cardCategory, description);
    newListItem.append(newCard);
    list.append(newListItem);

    cardImg.addEventListener('load', () => {
        load_images += 1
        if (load_images == amount) {
            load_images = 0;
            preloader.close();
            list.style.opacity = 1;
        }
    })

    newCard.addEventListener('click', () => {
        window.location = `/каталог/камень/${itemData.pk}`
    })
}

function set_bold(button) {
    let current = 300;
    const worker = setInterval(() => {
        current += 100
        button.style.fontWeight = current;
        if (current == 1000) {
            clearInterval(worker);
        }
    }, 100)
}

function set_thin(button) {
    let current = 1000;
    const worker = setInterval(() => {
        current -= 100
        button.style.fontWeight = current;
        if (current == 400) {
            clearInterval(worker);
        }
    }, 30)
}

async function load_items(item_id) {
    const response = await fetch(`api/get_items/${item_id}`);
    const data = response.json();
    return data;
}

function showCategories(panel) {
    document.body.style.overflow = 'hidden'
    const background = document.createElement('div');
    panel.style.transition = 'transform 300ms ease-in-out';
    background.classList.add('show-panel-back');
    document.body.append(background);
    setTimeout(() => {
        background.classList.add('show-panel-back--active');
    }, 20)
    panel.classList.add('categories-panel--active');
    background.addEventListener('click', () => {
        hideCategories(panel);
    })
}

function hideCategories(panel) {
    document.body.style.overflow = 'auto'
    const background = document.querySelector('.show-panel-back');
    background.classList.remove('show-panel-back--active');
    panel.style.transition = 'transform 300ms ease-in-out';
    panel.classList.remove('categories-panel--active');
    setTimeout(() => {
        document.body.removeChild(background);
    }, 220)
}

function autoscroll() {
    const position = window.scrollY;
    if (position > 400) {
        let delta;
        if (position < 600) {
            delta = 3
        }
        else if (position < 800) {
            delta = 4
        } else if (position < 1200) {
            delta = 8;
        } else {
            delta = 16;
        }
        let newPosition = window.scrollY - delta;
    
        const scroller = setInterval(() => {
            
            if (newPosition < 0) {
                newPosition = 0;
            }
            newPosition -= delta;
            window.scrollTo(0, newPosition);
            if (window.scrollY <= 0) {
                clearInterval(scroller);
                window.scrollTo(0, 0);
            }
        }, 1)
    }
    
}

class Preloader {
    constructor(parent) {
        this.parentBlock = parent;
        this.init();
        this.animated = false;
    }

    init() {
        this.preloader = document.createElement('div');
        this.preloader.classList.add('preloader');
    }

    activate() {
        if (!this.animated) {
            this.animated = true;
            this.parentBlock.append(this.preloader);
            setTimeout(() => {
                this.preloader.classList.add('preloader--active');
                this.preloader.addEventListener('transitionend', () => {
                    this.animated = false;
                })
            }, 20)
        }
    }

    close() {
        if (this.animated) {
            this.preloader.addEventListener('transitionend', () => {
                this.preloader.classList.remove('preloader--active');
                setTimeout(() => {
                    try {
                        this.parentBlock.removeChild(this.preloader);
                    } catch {

                    }
                    
                    this.animated = false;
                }, 320)
            })
        } else {
            this.preloader.classList.remove('preloader--active');
            setTimeout(() => {
                this.parentBlock.removeChild(this.preloader);
            }, 320)
    }
    }
}

export {get_items, set_bold, set_thin, showCategories, hideCategories, autoscroll}