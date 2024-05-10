import { removeCard, setLike, unLike } from "../components/api.js"


// Функция создания карточки
function createCard(card, profileId, cardTemplate, deleteCard, likeCard, openImageModal) {
    const cardId = card._id;
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

    if ( card.owner._id !== profileId ) {
        btnDeleteCard.remove();
    }

    cardImage.src = card.link;
    cardImage.alt = card.name;
    
    cardTitle.textContent = card.name;
    countLikeCard.textContent = card.likes.length;

    btnDeleteCard.addEventListener('click', () => deleteCard(cardId, placesItem));
    btnLikeCard.addEventListener('click', () => likeCard(cardId, btnLikeCard, countLikeCard));
    cardImage.addEventListener('click', () => openImageModal(cardImage, cardTitle));

    return placesItem;
}

// Функция удаления карточки
function deleteCard(cardId, placesItem) {
    removeCard(cardId)
        .then((response) => {
            placesItem.remove();
        })
        .catch((err) => {
            console.log(err);
        });
}

// Функция лайка карточки
function likeCard(cardId, btnLikeCard, countLikeCard) {
    if (btnLikeCard.classList.contains('card__like-button_is-active')) {
        unLike(cardId)
            .then((response) => {
                countLikeCard.textContent = response.likes.length;
                btnLikeCard.classList.toggle('card__like-button_is-active');
            })
            .catch((err) => {
                console.log(err);
            });
    } else {
        setLike(cardId)
            .then((response) => {
                countLikeCard.textContent = response.likes.length;
                btnLikeCard.classList.toggle('card__like-button_is-active');
            })
            .catch((err) => {
                console.log(err);
            });
    }
}

export { createCard, deleteCard, likeCard }