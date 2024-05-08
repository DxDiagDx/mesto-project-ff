// const validationConfig = {
//     formSelector: '.popup__form',
//     inputSelector: '.popup__input',
//     submitButtonSelector: '.popup__button',
//     inactiveButtonClass: 'popup__button_disabled',
//     inputErrorClass: 'popup__input_type_error',
//     errorClass: 'popup__error_visible',
//     errorClassPostfix: '-input-error'
// }

export const clearValidation = (formElement, validationConfig) => {
    const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
    const errorList = Array.from(formElement.querySelectorAll(`.${validationConfig.errorClass}`));

    inputList.forEach((inputElement) => {
        inputElement.classList.remove(validationConfig.inputErrorClass);
    })
    errorList.forEach((errorElement) => {
        errorElement.textContent = "";
        errorElement.classList.remove(validationConfig.errorClass);
    })
}

export const enableValidation = (validationConfig) => {
    const formList = Array.from(document.querySelectorAll(validationConfig.formSelector));
    
    formList.forEach((formElement) => {
        setEventListeners(formElement, validationConfig);
    })
};

const setEventListeners = (formElement, validationConfig) => {
    const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
    const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

    toggleButtonState(inputList, buttonElement, validationConfig);

    inputList.forEach((inputElement) => {
        inputElement.addEventListener('input', () => {
            isValid(formElement, inputElement, validationConfig);
            toggleButtonState(inputList, buttonElement, validationConfig);
        })
    })
}

const isValid = (formElement, inputElement, validationConfig) => {
    // устанавливаем кастомные сообщения
    if (inputElement.validity.patternMismatch) {
        inputElement.setCustomValidity(inputElement.dataset.errorMessage);
    } else {
        inputElement.setCustomValidity("");
    }

    // показываем или скрываем ошибку
    if (!inputElement.validity.valid) {
        showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
    } else {
        hideInputError(formElement, inputElement, validationConfig);
    }
}

const showInputError = (formElement, inputElement, errorMessage, validationConfig) => {
    const formError = formElement.querySelector(`.${inputElement.name}${validationConfig.errorClassPostfix}`);
    formError.textContent = errorMessage;
    formError.classList.add(validationConfig.errorClass);

    inputElement.classList.add(validationConfig.inputErrorClass);
}

const hideInputError = (formElement, inputElement, validationConfig) => {
    const formError = formElement.querySelector(`.${inputElement.name}${validationConfig.errorClassPostfix}`);
    formError.classList.remove(validationConfig.errorClass);

    inputElement.classList.remove(validationConfig.inputErrorClass);
}

// проверяем, что все поля формы проходят валидацию
const hasInvalidInput = (inputList) => {
    return inputList.some((inputElement) => {
        return !inputElement.validity.valid;
    })
};

const toggleButtonState = (inputList, buttonElement, validationConfig) => {
    if (hasInvalidInput(inputList)) {
        buttonElement.disabled = true;
        buttonElement.classList.add(validationConfig.inactiveButtonClass);
    } else {
        buttonElement.disabled = false;
        buttonElement.classList.remove(validationConfig.inactiveButtonClass);
    }
}