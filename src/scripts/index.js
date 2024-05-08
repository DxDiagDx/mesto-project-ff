import { getInitialCards, getUser, updateUser, postCard, updateAvatar } from "../components/api.js"
import { createCard, deleteCard, likeCard } from "../components/card.js";
import { openModal, closeModal } from '../components/modal.js'
import { enableValidation, clearValidation } from "../components/validation.js";

// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const placesList = document.querySelector('.places__list');

// Переменные для модальных окон
const btnProfileEdit = document.querySelector('.profile__edit-button');
const popupEdit = document.querySelector('.popup_type_edit');
const btnAddNewCard = document.querySelector('.profile__add-button');
const popupNewCard = document.querySelector('.popup_type_new-card');
const popupAvatar = document.querySelector('.popup_type_avatar');
const profileImage = document.querySelector('.profile__image');

// Переменные для форм
const formAvatar = document.forms['avatar'];
const formProfile = document.forms['edit-profile'];
const formNewPlace = document.forms['new-place'];

const nameInput = formProfile.elements['name'];
const jobInput = formProfile.elements['description'];
const profileInfo = document.querySelector('.profile__info');
const profileTitle = profileInfo.querySelector('.profile__title');
const profileDesc = profileInfo.querySelector('.profile__description');

let profileId;

// конфигурация для валидации
const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible',
    errorClassPostfix: '-input-error'
}

// включение валидации
enableValidation(validationConfig);

// Получаем информацию о пользователе
const promisUser = getUser();

// Получаем карточки
const promisInitialCards = getInitialCards();

// Создаём массив с промисами
const promises = [promisUser, promisInitialCards]

Promise.all(promises)
    .then(([user, initialCards]) => {
        showUserProfile(user);
        showCards(initialCards);
    })
    .catch((err) => {
        console.log(err);
    });

// Вывести информацию о пользователе на страницу
const showUserProfile = (user) => {
    profileId = user._id;
    profileTitle.textContent = user.name;
    profileDesc.textContent = user.about;
    profileImage.style.backgroundImage = `url(${user.avatar})`;
}

// Выводим карточки на страницу
const showCards = (initialCards) => {
    initialCards.forEach((card) => {
        showCard(card);
    });
}


// Работаем с модальными окнами
function handlerClick(evt) {
    const currentModal = evt.target.closest('.popup');

    // закрываем по клику на оверлей
    if (evt.target.classList.contains('popup')) {
        closeModal(currentModal);
    }

    // закрываем по клику на кнопку закрытия
    if (evt.target.classList.contains('popup__close')) {
        closeModal(currentModal);
    }

    // открываем попап по клику на редактирование профиля
    if (evt.target === btnProfileEdit) {
        nameInput.value = profileTitle.textContent;
        jobInput.value = profileDesc.textContent;

        clearValidation(formProfile, validationConfig); 
        openModal(popupEdit);
    }

    // открываем попап по клику на добавление карточки
    if (evt.target === btnAddNewCard) {
        formNewPlace.reset();
        clearValidation(formNewPlace, validationConfig); 
        openModal(popupNewCard);
    }

    // открываем попап по клику на редактирование аватара
    if (evt.target === profileImage) {
        formAvatar.reset();
        clearValidation(formAvatar, validationConfig); 
        openModal(popupAvatar);
    }
}

document.addEventListener('click', handlerClick);


// обработчики отправки форм
// функция-обработчик события открытия модального окна для редактирования профиля
function handleFormProfileSubmit(evt) {
    evt.preventDefault();

    const modal = evt.target.closest('.popup');
    const btnSubmit = evt.target.querySelector('.popup__button');
    btnSubmit.textContent = "Сохранение...";

    // Получаем значение полей jobInput и nameInput из свойства value
    const name = nameInput.value;
    const about = jobInput.value;
    
    // Отправляем новые данные на сервер
    updateUser({name, about})
        .then((response) => {
            // Вставляем новые значения с помощью textContent
            profileTitle.textContent = name;
            profileDesc.textContent = about;
            btnSubmit.textContent = "Сохранение";
            closeModal(modal);
        })
        .catch((err) => {
            console.log(err)
        });    
}

formProfile.addEventListener('submit', handleFormProfileSubmit);

// Отправка формы добавления новой карточки
function handleFormNewPlaceSubmit(evt) {
    evt.preventDefault();

    const modal = evt.target.closest('.popup');
    const btnSubmit = evt.target.querySelector('.popup__button');
    btnSubmit.textContent = "Сохранение...";

    // Получаем link и namePlace из свойства value
    const link = formNewPlace.elements['link'].value;
    const namePlace = formNewPlace.elements['place-name'].value;

    // Выберите элементы, куда должны быть вставлены значения полей
    const card = {
        link,
        name: namePlace
    };

    // отправляем карточку на сервер
    postCard(card)
        .then((result) => {
            // Добавляем на сайт
            const placesItem = createCard(result, profileId, cardTemplate, deleteCard, likeCard, openImageModal);
            placesList.prepend(placesItem);
            btnSubmit.textContent = "Сохранение";
            closeModal(modal);
        })
        .catch((err) => {
            console.log(err);
        });    
}

formNewPlace.addEventListener('submit', handleFormNewPlaceSubmit);


// Отправка формы добавления новой карточки
function handleFormAvatarSubmit(evt) {
    evt.preventDefault();
    const modal = evt.target.closest('.popup');
    const btnSubmit = evt.target.querySelector('.popup__button');
    btnSubmit.textContent = "Сохранение...";

    const avatar = formAvatar.elements['avatar'].value;

    updateAvatar(avatar)
        .then((response) => {
            profileImage.style.backgroundImage = `url(${response.avatar})`;
            btnSubmit.textContent = "Сохранение";
            closeModal(modal);
        })
        .catch((err) => {
            console.log(err);
        })
}

formAvatar.addEventListener('submit', handleFormAvatarSubmit);


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


// отображение карточек при открытии страницы
function showCard(card) {
    const placesItem = createCard(card, profileId, cardTemplate, deleteCard, likeCard, openImageModal);
    placesList.append(placesItem);
}