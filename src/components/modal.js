function openModal(modal) {
    const btnClose = modal.querySelector('.popup__close');

    modal.classList.add('popup_is-opened');
    btnClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', closeModalEsc);
}

function closeModal(evt) {
    const modal = document.querySelector('.popup_is-opened');
    const btnClose = evt.target;

    modal.classList.remove('popup_is-opened');
    btnClose.removeEventListener('click', closeModal);
}

function closeModalEsc(evt) {
    const modal = document.querySelector('.popup_is-opened');

    if ('Escape' === evt.key) {
        modal.classList.remove('popup_is-opened');
        document.removeEventListener('keydown', closeModalEsc);
    }
}

export { openModal, closeModal }