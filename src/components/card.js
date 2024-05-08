import { removeCard, setLike, unLike } from "../components/api.js"


// Функция создания карточки
function createCard(card, profileId, cardTemplate, deleteCard, likeCard, openImageModal) {
    const placesItem = cardTemplate.querySelector('.places__item').cloneNode(true);
    const cardImage = placesItem.querySelector('.card__image');
    const cardTitle = placesItem.querySelector('.card__title');
    const btnDeleteCard = placesItem.querySelector('.card__delete-button');
    const btnLikeCard = placesItem.querySelector('.card__like-button');
    const countLikeCard = placesItem.querySelector('.card__like-count');
    
    const hasUserLike = card.likes.some(like => {
        return like._id === profileId
    });
    if (hasUserLike) {
        btnLikeCard.classList.add('card__like-button_is-active');
    }

    placesItem.dataset.id = card._id;

    if ( card.owner._id !== profileId ) {
        btnDeleteCard.remove();
    }

    cardImage.src = card.link;
    cardImage.alt = card.name;
    
    cardTitle.textContent = card.name;
    countLikeCard.textContent = card.likes.length;

    btnDeleteCard.addEventListener('click', deleteCard);
    btnLikeCard.addEventListener('click', likeCard);
    cardImage.addEventListener('click', openImageModal);

    return placesItem;
}

// Функция удаления карточки
function deleteCard(evt) {
    const placesItem = evt.target.closest('.places__item');

    removeCard(placesItem.dataset.id)
        .then((response) => {
            placesItem.remove();
        })
        .catch((err) => {
            console.log(err);
        });
}

// Функция лайка карточки
function likeCard(evt) {
    const btnLikeCard = evt.target;
    const placesItem = btnLikeCard.closest('.places__item');
    const countLikeCard = placesItem.querySelector('.card__like-count');

    const cardId = placesItem.dataset.id;
    const hasLikeCard = btnLikeCard.classList.contains('card__like-button_is-active');

    if (hasLikeCard) {
        unLike(cardId)
            .then((response) => {
                countLikeCard.textContent = response.likes.length;
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        setLike(cardId)
            .then((response) => {
                countLikeCard.textContent = response.likes.length;
            })
            .catch((err) => {
                console.log(err);
            });
    }

    btnLikeCard.classList.toggle('card__like-button_is-active');
}

export { createCard, deleteCard, likeCard }