'use strict';

/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Обработка загрузки фото

const SCALE_STEP = 25;
const SCALE_MAX = 75;
const SCALE_MIN = 25;
const PHOBOS_PROPORTION = 3;
const HEAT_PROPORTION = 3;
const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];

const imgUploadOverlay = document.querySelector(`.img-upload__overlay`);
const imgUploadCancel = imgUploadOverlay.querySelector(`.img-upload__cancel`);
const uploadFile = document.querySelector(`#upload-file`);
const imgUploadForm = document.querySelector(`.img-upload__form`);
const textDescription = imgUploadOverlay.querySelector(`.text__description`);
const textHashtags = imgUploadOverlay.querySelector(`.text__hashtags`);
const main = document.querySelector(`main`);

const closeImgUpload = () => {

  imgUploadOverlay.classList.add(`hidden`);
  uploadFile.value = ``;
  uploadFile.addEventListener(`change`, uploadFileChangeHandler);

  document.removeEventListener(`keydown`, window.preview.documentKeydownHandler);
  imgUploadCancel.removeEventListener(`click`, imgUploadCancelClickHandler);
  window.preview.body.classList.remove(`modal-open`);
  scaleControlBigger.removeEventListener(`click`, scaleControlBiggerClickHandler);
  scaleControlSmaller.removeEventListener(`click`, scaleControlSmallerClickHandler);

  // Сбрасываю параметры фото при его закрытии
  textHashtags.setCustomValidity(``);
  effectnone.checked = true;
  imgUploadEffectLevel.classList.add(`hidden`);
  imgUploadPreviewImg.classList = ``;
  scaleControlValue.value = `100%`;
  imgUploadPreviewImg.style = ``;
  effectLevelValue.value = ``;
  textHashtags.value = ``;
  textDescription.value = ``;
};

const openImgUpload = () => {
  imgUploadOverlay.classList.remove(`hidden`);
  window.preview.body.classList.add(`modal-open`);
  document.addEventListener(`keydown`, window.preview.documentKeydownHandler);
  imgUploadCancel.addEventListener(`click`, imgUploadCancelClickHandler);
  scaleControlBigger.addEventListener(`click`, scaleControlBiggerClickHandler);
  scaleControlSmaller.addEventListener(`click`, scaleControlSmallerClickHandler);

  uploadFile.removeEventListener(`change`, uploadFileChangeHandler);
};

const uploadFileChangeHandler = () => {
  renderNewPicture();
  openImgUpload();
};

const imgUploadCancelClickHandler = () => {
  closeImgUpload();
};

uploadFile.addEventListener(`change`, uploadFileChangeHandler);

/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Обработка ползунка

const effectLevelPin = imgUploadOverlay.querySelector(`.effect-level__pin`);
const effectLevelValue = imgUploadOverlay.querySelector(`.effect-level__value`);
const effectLevelLine = imgUploadOverlay.querySelector(`.effect-level__line`);
const effectLevelDepth = imgUploadOverlay.querySelector(`.effect-level__depth`);

/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Обработка смены фильтра
const imgUploadPreview = imgUploadOverlay.querySelector(`.img-upload__preview`);
const imgUploadPreviewImg = imgUploadPreview.querySelector(`img`);
const imgUploadEffectLevel = imgUploadOverlay.querySelector(`.img-upload__effect-level`);
const effectsList = imgUploadOverlay.querySelector(`.effects__list`);
const effectsItems = effectsList.querySelectorAll(`.effects__item`);
const effectnone = effectsList.querySelector(`#effect-none`);
let newFilterValue;

const effectsItemChangeHandler = (evt) => {
  imgUploadPreviewImg.classList = ``;
  imgUploadPreviewImg.style = ``;
  if (evt.target.value === `none`) {
    imgUploadEffectLevel.classList.add(`hidden`);
  } else {
    imgUploadEffectLevel.classList.remove(`hidden`);
  }
  effectLevelPin.style.left = effectLevelLine.getBoundingClientRect().width + `px`;
  effectLevelDepth.style.width = effectLevelLine.getBoundingClientRect().width + `px`;

  newFilterValue = evt.target.value;
  imgUploadPreviewImg.classList.add(`effects__preview--` + newFilterValue);
  effectLevelValue.value = 100;
};

// Сбрасываю уровень эффекта при смене фильтра
effectsItems.forEach(function (item) {
  item.addEventListener(`change`, effectsItemChangeHandler);
});

const effectLevelPinMousedownHandler = (downEvt) => {
  downEvt.preventDefault();

  const startCoords = {
    x: downEvt.clientX,
  };

  const currentPosition = parseInt(effectLevelPin.style.left, 10) || 0;
  const effectLevelLineWidth = effectLevelLine.getBoundingClientRect().width;

  const documentMouseMoveHandler = (moveEvt) => {
    moveEvt.preventDefault();

    const shift = {
      x: startCoords.x - moveEvt.clientX,
    };

    let newPosition = currentPosition - shift.x;

    if (newPosition < 0) {
      newPosition = 0;
    } else if (newPosition > effectLevelLineWidth) {
      newPosition = effectLevelLineWidth;
    }

    effectLevelPin.style.left = newPosition + `px`;
    effectLevelDepth.style.width = newPosition + `px`;

    effectLevelValue.value = Math.round(100 * (newPosition / effectLevelLineWidth));
    const proportion = effectLevelValue.value / 100;

    switch (newFilterValue) {
      case `chrome`:
        imgUploadPreviewImg.style = `filter: grayscale(${proportion})`;
        break;
      case `sepia`:
        imgUploadPreviewImg.style = `filter: sepia(${proportion})`;
        break;
      case `marvin`:
        imgUploadPreviewImg.style = `filter: invert(${effectLevelValue.value}%)`;
        break;
      case `phobos`:
        imgUploadPreviewImg.style = `filter: blur(${proportion * PHOBOS_PROPORTION}px)`;
        break;
      case `heat`:
        imgUploadPreviewImg.style = `filter: brightness(${proportion * HEAT_PROPORTION})`;
        break;
    }
  };

  const documentMouseupHandler = (upEvt) => {
    upEvt.preventDefault();

    document.removeEventListener(`mousemove`, documentMouseMoveHandler);
    document.removeEventListener(`mouseup`, documentMouseupHandler);
    effectLevelPin.addEventListener(`mousedown`, effectLevelPinMousedownHandler);

  };

  document.addEventListener(`mousemove`, documentMouseMoveHandler);
  document.addEventListener(`mouseup`, documentMouseupHandler);
};
effectLevelPin.addEventListener(`mousedown`, effectLevelPinMousedownHandler);

/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Валидация хеш-тегов и комментов

const textHashtagsInputHandler = (evt) => {
  const validationRules = /(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,20})(\b|\r)/gi;
  const hashtags = evt.target.value.match(validationRules) || [];
  const hasDuplicates = new Set(hashtags).size !== hashtags.length;

  if (validationRules.test(evt.target.value) && hashtags.length <= 5 && !hasDuplicates) {
    textHashtags.setCustomValidity(``);
  } else {
    textHashtags.setCustomValidity(`Такой хэштег невозможен`);
  }
};
textHashtags.addEventListener(`input`, textHashtagsInputHandler);

/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Масштабирование
const scaleControlSmaller = imgUploadOverlay.querySelector(`.scale__control--smaller`);
const scaleControlBigger = imgUploadOverlay.querySelector(`.scale__control--bigger`);
const scaleControlValue = imgUploadOverlay.querySelector(`.scale__control--value`);

const scaleControlSmallerClickHandler = () => {
  const currentScale = Number(scaleControlValue.value.substring(0, scaleControlValue.value.length - 1));
  if (currentScale > SCALE_MIN) {
    scaleControlValue.value = (currentScale - SCALE_STEP) + `%`;
  }
  changeScale();
};

const scaleControlBiggerClickHandler = () => {
  const currentScale = Number(scaleControlValue.value.substring(0, scaleControlValue.value.length - 1));
  if (currentScale <= SCALE_MAX) {
    scaleControlValue.value = (currentScale + SCALE_STEP) + `%`;
  }
  changeScale();
};

const changeScale = () => {
  const currentScale = Number(scaleControlValue.value.substring(0, scaleControlValue.value.length - 1));
  const scaleProportion = currentScale / 100;
  imgUploadPreviewImg.style = `transform: scale(${scaleProportion});`;
};

/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Обработка отправки формы
const successTemplate = document.querySelector(`#success`)
  .content
  .querySelector(`.success`);

const errorTemplate = document.querySelector(`#error`)
  .content
  .querySelector(`.error`);

const openSuccessWindow = () => {
  const success = document.querySelector(`.success`);
  const successButton = document.querySelector(`.success__button`);
  successButton.addEventListener(`click`, successButtonClickHandler);
  success.addEventListener(`click`, successClickHandler);
  document.addEventListener(`keydown`, window.preview.documentKeydownHandler);
};

const successButtonClickHandler = () => {
  closeSuccessWindow();
};

const successClickHandler = (evt) => {
  const successInner = document.querySelector(`.success__inner`);
  const successButton = document.querySelector(`.success__button`);
  if (successInner) {
    if (evt.target !== successInner && evt.target !== successButton) {
      closeSuccessWindow();
    }
  }
};

const closeSuccessWindow = () => {
  const success = document.querySelector(`.success`);
  const successButton = document.querySelector(`.success__button`);
  success.parentNode.removeChild(success);
  successButton.removeEventListener(`click`, successButtonClickHandler);
  document.removeEventListener(`keydown`, window.preview.documentKeydownHandler);
};

const formSuccessHandler = () => {
  const successWindow = successTemplate.cloneNode(true);
  main.appendChild(successWindow);
  openSuccessWindow();
};

const closeErrorWindow = () => {
  const error = document.querySelector(`.error`);
  const errorButton = document.querySelector(`.error__button`);
  error.parentNode.removeChild(error);
  errorButton.removeEventListener(`click`, errorButtonClickHandler);
  error.removeEventListener(`click`, errorClickHandler);
  document.removeEventListener(`keydown`, window.preview.documentKeydownHandler);
};

const errorButtonClickHandler = () => {
  closeErrorWindow();
};

const errorClickHandler = (evt) => {
  const errorInner = document.querySelector(`.error__inner`);
  const errorButton = document.querySelector(`.error__button`);
  if (errorInner) {
    if (evt.target !== errorInner && evt.target !== errorButton) {
      closeErrorWindow();
    }
  }
};

const openErrorWindow = () => {
  const errorButton = document.querySelector(`.error__button`);
  const error = document.querySelector(`.error`);
  errorButton.addEventListener(`click`, errorButtonClickHandler);
  document.addEventListener(`keydown`, window.preview.documentKeydownHandler);
  error.addEventListener(`click`, errorClickHandler);
};

const formErrorHandler = () => {
  const errorWindow = errorTemplate.cloneNode(true);
  main.appendChild(errorWindow);
  openErrorWindow();
};

imgUploadForm.addEventListener(`submit`, function (evt) {
  window.backend.saveForm(new FormData(imgUploadForm), formSuccessHandler, formErrorHandler);
  closeImgUpload();
  evt.preventDefault();
});


/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Заменяю большую фото
const renderNewPicture = () => {
  const file = uploadFile.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some(function (it) {
    return fileName.endsWith(it);
  });

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener(`load`, function () {
      imgUploadPreviewImg.src = reader.result;
    });

    reader.readAsDataURL(file);
  }
};

window.form = {
  textDescription,
  textHashtags,
  closeImgUpload,
  closeSuccessWindow,
  closeErrorWindow,
};
