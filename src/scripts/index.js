import { initialCards } from "../components/cards";
import { createCard, deleteCard, likeCard } from "../components/card";
import { openModal, closeModal } from '../components/modal'

// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const placesList = document.querySelector('.places__list');

// Переменные для модальных окон
const btnProfileEdit = document.querySelector('.profile__edit-button');
const popupEdit = document.querySelector('.popup_type_edit');
const btnAddNewCard = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');

// Переменные для форм
const formNewPlace = document.forms['new-place'];
const formProfile = document.forms['edit-profile'];
const nameInput = formProfile.elements['name'];
const jobInput = formProfile.elements['description'];
const profileInfo = document.querySelector('.profile__info');
const profileTitle = profileInfo.querySelector('.profile__title');
const profileDesc = profileInfo.querySelector('.profile__description');


// Работаем с модальными окнами
function handlerClick(evt) {
    const currentPopup = document.querySelector('.popup_is-opened');
    // закрываем по клику на оверлей
    if (evt.target === currentPopup) {
        closeModal(evt);
    }
    // открываем попап по клику на редактирование профиля
    if (evt.target === btnProfileEdit) {
        nameInput.value = profileTitle.textContent;
        jobInput.value = profileDesc.textContent;
        openModal(popupEdit);
    }
    // открываем попап по клику на добавление карточки
    if (evt.target === btnAddNewCard) {
        openModal(popupNewCard);
    }
}

document.addEventListener('click', handlerClick);

// обработчики отправки форм
// функция-обработчик события открытия модального окна для редактирования профиля
function handleFormProfileSubmit(evt) {
    evt.preventDefault();

    // Получите значение полей jobInput и nameInput из свойства value
    const name = nameInput.value;
    const desc = jobInput.value;

    // Выберите элементы, куда должны быть вставлены значения полей

    // Вставьте новые значения с помощью textContent
    profileTitle.textContent = name;
    profileDesc.textContent = desc;

    closeModal(evt);
}

formProfile.addEventListener('submit', handleFormProfileSubmit);

// Отправка формы добавления новой карточки
function handleFormNewPlaceSubmit(evt) {
    evt.preventDefault();

    // Получите значение полей jobInput и nameInput из свойства value
    const link = formNewPlace.elements['link'].value;
    const namePlace = formNewPlace.elements['place-name'].value;

    // Выберите элементы, куда должны быть вставлены значения полей
    const card = {};
    card.link = link;
    card.name = namePlace;

    // Вставьте новые значения с помощью textContent
    const placesItem = createCard(card, cardTemplate, deleteCard, likeCard, openImageModal);
    placesList.prepend(placesItem);

    formNewPlace.reset();

    closeModal(evt);
}

formNewPlace.addEventListener('submit', handleFormNewPlaceSubmit);

// функция открытия модального окна изображения карточки
function openImageModal(evt) {
    const image = evt.target;
    const title= image.parentElement.querySelector('.card__title');
    const popupImage = document.querySelector('.popup_type_image');
    const imgContainer = popupImage.querySelector('img');
    const imgCaption = popupImage.querySelector('.popup__caption');

    imgContainer.src = image.src;
    imgContainer.alt = image.alt;
    imgCaption.textContent = title.textContent;

    openModal(popupImage);
}

// отображение шести карточек при открытии страницы
function showCard(card, deleteCard) {
    const placesItem = createCard(card, cardTemplate, deleteCard, likeCard, openImageModal);
    placesList.append(placesItem);
}

// Вывести карточки на страницу
initialCards.forEach((card) => showCard(card, deleteCard));