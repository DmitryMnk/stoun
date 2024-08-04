class photoSwitcher {
    constructor(photos) {
        this.photos = photos;
        this.init();
        this.activeIndex = 0;
    }

    init() {
        this.photoModal = document.createElement('div');

        const photosBLock = document.createElement('div');
        const prevButton = document.createElement('button');
        const nextButton = document.createElement('button');
        const closeButton = document.createElement('button');
        const prevArrow = document.createElement('span');
        const nextArrow = document.createElement('span');
        const closeButtonFirstLine = document.createElement('div');
        const closeButtonSecondLine = document.createElement('div');
        this.img = document.createElement('img');

        this.photoModal.classList.add('photo-switcher');
        photosBLock.classList.add('photo-switcher-wrapper');
        prevButton.classList.add('photo-switcher-button', 'photo-switcher-prev-button', 'reset-button');
        nextButton.classList.add('photo-switcher-button', 'photo-switcher-next-button', 'reset-button');
        closeButton.classList.add('photo-switcher-close-button', 'reset-button');
        this.img.classList.add('photo-switcher-active-img');
        prevArrow.classList.add('photo-switcher-prev-arrow', 'photo-switcher-arrow');
        nextArrow.classList.add('photo-switcher-next-arrow', 'photo-switcher-arrow');
        closeButtonFirstLine.classList.add('photo-switcher-close-button-line', 'photo-switcher-close-button-first-line')
        closeButtonSecondLine.classList.add('photo-switcher-close-button-line', 'photo-switcher-close-button-second-line')

        prevButton.appendChild(prevArrow);
        nextButton.appendChild(nextArrow);
        closeButton.append(closeButtonFirstLine, closeButtonSecondLine)
        photosBLock.append(prevButton, this.img, nextButton);
        this.photoModal.append(photosBLock, closeButton);

        this.photos.forEach(elem => elem.addEventListener('click', () => {
            this.activate(elem);
        }))

        this.photoModal.addEventListener('click', (e) => {
            if (e.target == this.photoModal) {
                this.close();
            }
        })

        prevButton.addEventListener('click', () => {
            this.prev();
        })

        nextButton.addEventListener('click', () => {
            this.next();
        })

        this.img.addEventListener('click', () => {
            this.next();
        })

        closeButton.addEventListener('click', () => {
            this.close();
        })
    }

    activate(img) {
        this.activeIndex = Array.prototype.indexOf.call(this.photos, img);
        document.body.append(this.photoModal);
        this.img.src = img.src;
        this.img.id = this.activeIndex;
        setTimeout(() => {
            this.photoModal.classList.add('photo-switcher--active');
        }, 10)

        setTimeout(() => {
            document.body.style.overflow = 'hidden';
        }, 300)
    }

    close() {
        document.body.style.overflow = 'auto';
        this.photoModal.classList.remove('photo-switcher--active');
        setTimeout(() => {
            document.body.removeChild(this.photoModal);
        }, 300)
    }

    next() {
        const nextPhoto = this.photos[(this.activeIndex + 1) % this.photos.length];
        this.activeIndex = Array.prototype.indexOf.call(this.photos, nextPhoto);
        this.img.src = nextPhoto.src;
    }

    prev() {
        let prevPhoto;
        if (this.activeIndex == 0) {
            prevPhoto = this.photos[this.photos.length - 1];
        } else {
            prevPhoto = this.photos[(this.activeIndex - 1) % this.photos.length];
        }
        
        this.activeIndex = Array.prototype.indexOf.call(this.photos, prevPhoto);
        this.img.src = prevPhoto.src;
    }
}

export {photoSwitcher}