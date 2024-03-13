// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// @todo: DOM узлы
const placesList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCard(card, { deleteCard }) {
    const placesItem = cardTemplate.querySelector('.places__item').cloneNode(true);
    const cardImage = placesItem.querySelector('.card__image');
    const cardTitle = placesItem.querySelector('.card__title');
    const cardDeleteButton = placesItem.querySelector('.card__delete-button');

    cardImage.src = card.link;
    cardImage.alt = card.name;
    cardTitle.textContent = card.name;

    cardDeleteButton.addEventListener('click', deleteCard);

    return placesItem;
}

function showCard(card, deleteCard) {
    const placesItem = createCard(card, { deleteCard });
    placesList.append(placesItem);
}

// @todo: Функция удаления карточки
function deleteCard(evt) {
    const placesItem = evt.target.closest('.places__item');
    placesItem.remove();
}

// @todo: Вывести карточки на страницу
initialCards.forEach((card) => showCard(card, deleteCard));