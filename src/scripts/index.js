import { getInitialCards, getUser, updateUser, postCard, updateAvatar } from "../components/api.js"
import { createCard, deleteCard, likeCard } from "../components/card.js";
import { openModal, closeModal } from '../components/modal.js'
import { enableValidation, clearValidation } from "../components/validation.js";

// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;

// DOM узлы
const placesList = document.querySelector('.places__list');

// Переменные для модальных окон
const popupAvatar = document.querySelector('.popup_type_avatar');
const profileImage = document.querySelector('.profile__image');

const popupNewCard = document.querySelector('.popup_type_new-card');
const btnAddNewCard = document.querySelector('.profile__add-button');

const popupImage = document.querySelector('.popup_type_image');
const imgContainer = popupImage.querySelector('img');
const imgCaption = popupImage.querySelector('.popup__caption');

const popupEdit = document.querySelector('.popup_type_edit');
const btnProfileEdit = document.querySelector('.profile__edit-button');

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

Promise.all([getUser(), getInitialCards()])
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
// открываем попап по клику на аватар
const openFormEditAvatar = () => {
    formAvatar.reset();
    clearValidation(formAvatar, validationConfig); 
    openModal(popupAvatar);
}
profileImage.addEventListener('click', openFormEditAvatar)

// открываем попап по клику на добавление карточки
const openFormAddNewPlace = () => {
    formNewPlace.reset();
    clearValidation(formNewPlace, validationConfig); 
    openModal(popupNewCard);
}
btnAddNewCard.addEventListener('click', openFormAddNewPlace);

// открываем попап по клику на редактирование профиля
const openFormProfile = () => {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDesc.textContent;
    clearValidation(formProfile, validationConfig); 
    openModal(popupEdit);
}
btnProfileEdit.addEventListener('click', openFormProfile);

// обработчики отправки форм
// функция-обработчик события открытия модального окна для редактирования профиля
function handleFormProfileSubmit(evt) {
    evt.preventDefault();

    const modal = evt.target.closest('.popup');
    const btnSubmit = evt.submitter;

    // Получаем значение полей jobInput и nameInput из свойства value
    const name = nameInput.value;
    const about = jobInput.value;
    
    btnSubmit.textContent = "Сохранение...";

    // Отправляем новые данные на сервер
    updateUser({name, about})
        .then((response) => {
            // Вставляем новые значения с помощью textContent
            profileTitle.textContent = response.name;
            profileDesc.textContent = response.about;
            closeModal(modal);
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            btnSubmit.textContent = "Сохранение";
        });
}
formProfile.addEventListener('submit', handleFormProfileSubmit);

// Отправка формы добавления новой карточки
function handleFormNewPlaceSubmit(evt) {
    evt.preventDefault();

    const modal = evt.target.closest('.popup');
    const btnSubmit = evt.submitter;

    // Получаем link и namePlace из свойства value
    const link = formNewPlace.elements['link'].value;
    const namePlace = formNewPlace.elements['place-name'].value;

    // Выберите элементы, куда должны быть вставлены значения полей
    const card = {
        link,
        name: namePlace
    };

    btnSubmit.textContent = "Сохранение...";

    // отправляем карточку на сервер
    postCard(card)
        .then((result) => {
            // Добавляем на сайт
            const placesItem = createCard(result, profileId, cardTemplate, deleteCard, likeCard, openImageModal);
            placesList.prepend(placesItem);
            closeModal(modal);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            btnSubmit.textContent = "Сохранение";
        });    
}
formNewPlace.addEventListener('submit', handleFormNewPlaceSubmit);


// Отправка формы добавления новой карточки
function handleFormAvatarSubmit(evt) {
    evt.preventDefault();
    const modal = evt.target.closest('.popup');
    const btnSubmit = evt.submitter;
    const avatar = formAvatar.elements['avatar'].value;

    btnSubmit.textContent = "Сохранение...";

    updateAvatar(avatar)
        .then((response) => {
            profileImage.style.backgroundImage = `url(${response.avatar})`;
            closeModal(modal);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            btnSubmit.textContent = "Сохранение";
        });
}
formAvatar.addEventListener('submit', handleFormAvatarSubmit);


// функция открытия модального окна изображения карточки
function openImageModal(image, title) {
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