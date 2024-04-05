// Функция создания карточки
function createCard(card, cardTemplate, deleteCard, likeCard, openImageModal) {
    const placesItem = cardTemplate.querySelector('.places__item').cloneNode(true);
    const cardImage = placesItem.querySelector('.card__image');
    const cardTitle = placesItem.querySelector('.card__title');
    const btnDeleteCard = placesItem.querySelector('.card__delete-button');
    const btnLikeCard = placesItem.querySelector('.card__like-button');

    cardImage.src = card.link;
    cardImage.alt = card.name;

    cardTitle.textContent = card.name;

    btnDeleteCard.addEventListener('click', deleteCard);
    btnLikeCard.addEventListener('click', likeCard);
    cardImage.addEventListener('click', openImageModal);

    return placesItem;
}

// Функция удаления карточки
function deleteCard(evt) {
    const placesItem = evt.target.closest('.places__item');
    placesItem.remove();
}

// Функция лайка карточки
function likeCard(evt) {
    const btnLikeCard = evt.target;
    btnLikeCard.classList.toggle('card__like-button_is-active');
}

export { createCard, deleteCard, likeCard }