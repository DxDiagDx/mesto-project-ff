function openModal(modal) {
    modal.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeModalEsc);
    modal.addEventListener('click', (evt) => closeModalByClick(evt, modal));
}

function closeModal(modal) {
    modal.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closeModalEsc);
}

function closeModalEsc(evt) {
    if ('Escape' === evt.key) {
        const modal = document.querySelector('.popup_is-opened');
        closeModal(modal);
    }
}

function closeModalByClick(evt, modal) {
    if (evt.target.classList.contains('popup') || evt.target.classList.contains('popup__close')) {
        closeModal(modal);
    }
}

export { openModal, closeModal }