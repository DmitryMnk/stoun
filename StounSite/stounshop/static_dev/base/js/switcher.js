class Switcher {
    constructor(baseBlock) {
        this.baseBlock = baseBlock
        this.initButtons
        this.initButtons();
        this.initItems();
        
        this.animation = true;

    }

    initButtons() {
        this.switchButtons = this.baseBlock.querySelectorAll('.switcher-button');
        this.switchButtons[0].classList.add('switcher-button--active');
        const nextButton = this.baseBlock.querySelector('.services__switcher-next')
        this.switchButtons.forEach(elem => elem.addEventListener('click', () => {
            this.switch(elem);
        }        
        ))

        nextButton.addEventListener('click', () => {
            const activeButton = this.baseBlock.querySelector('.switcher-button--active')
            const elemNumber = activeButton.id[activeButton.id.length - 1]
            const nextActivation = this.switchButtons[elemNumber % this.switchButtons.length]
            this.switch(nextActivation)
        })
    }

    initItems() {
        this.items = this.baseBlock.querySelectorAll('.switcher-content-item');
        this.items.forEach(elem => elem.style.transform = 'translateX(-150px)');
        this.items.forEach(elem => elem.style.opacity = '0');
        this.items[0].classList.add('switcher-item--active');
        this.items[0].style.transform = 'translateX(0px)';
        this.items[0].style.opacity = '1';
    }

    switch(button) {
        if (!button.classList.contains('switcher-button--active') && this.animation) {
            this.switchButtons.forEach(button => button.classList.remove('switcher-button--active'))
            button.classList.add('switcher-button--active');
            const elemNumber = button.id[button.id.length - 1]
            this.switchItem(elemNumber)
        }
    }

    switchItem(itemNum) {
        if (this.animation) {
            const item = this.items[itemNum - 1]
            this.animation = false;
            const activeItem = this.baseBlock.querySelector('.switcher-item--active');
            activeItem.style.transform = 'translateX(150px)'
            activeItem.style.opacity = '0'
            setTimeout(() => {
                activeItem.classList.remove('switcher-item--active');
                item.classList.add('switcher-item--active')
                activeItem.style.transform = 'translateX(-150px)'
            }, 300)

            setTimeout(() => {
                item.style.transform = 'translateX(0px)'
                item.style.opacity = '1'
            }, 340)
            setTimeout(() => {
                this.animation = true;
            }, 700)
        }
        

    }
}

export {Switcher}