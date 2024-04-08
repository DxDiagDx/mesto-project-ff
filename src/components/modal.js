function openModal(modal) {
    modal.classList.add('popup_is-opened');
    document.addEventListener('keydown', closeModalEsc);
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

export { openModal, closeModal }