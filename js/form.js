'use strict';
(function () {
/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Обработка загрузки фото
  var imgUploadOverlay = document.querySelector(`.img-upload__overlay`);
  var imgUploadCancel = imgUploadOverlay.querySelector(`.img-upload__cancel`);
  var uploadFile = document.querySelector(`#upload-file`);
  var imgUploadForm = document.querySelector(`.img-upload__form`);
  var textDescription = imgUploadOverlay.querySelector(`.text__description`);
  var textHashtags = imgUploadOverlay.querySelector(`.text__hashtags`);
  var main = document.querySelector(`main`);

  var closeImgUpload = function () {
    imgUploadOverlay.classList.add(`hidden`);
    uploadFile.value = ``;
    uploadFile.addEventListener(`change`, uploadFileChangeHandler);

    document.removeEventListener(`keydown`, window.preview.documentKeydownHandler);
    imgUploadCancel.removeEventListener(`click`, imgUploadCancelClickHandler);
    window.preview.body.classList.remove(`modal-open`);
    scaleControlBigger.removeEventListener(`click`, scaleControlBiggerClickHandler);
    scaleControlSmaller.removeEventListener(`click`, scaleControlSmallerClickHandler);

    // Сбрасываю параметры фото при его закрытии
    effectnone.checked = true;
    imgUploadEffectLevel.classList.add(`hidden`);
    imgUploadPreviewImg.classList = ``;
    scaleControlValue.value = `100%`;
    // imgUploadPreviewImg.style = `transform: scale(1);`;
    imgUploadPreviewImg.style = ``;
    effectLevelValue.value = ``;
    textHashtags.value = ``;
    textDescription.value = ``;
  };

  var openImgUpload = function () {
    imgUploadOverlay.classList.remove(`hidden`);
    window.preview.body.classList.add(`modal-open`);
    document.addEventListener(`keydown`, window.preview.documentKeydownHandler);
    imgUploadCancel.addEventListener(`click`, imgUploadCancelClickHandler);
    scaleControlBigger.addEventListener(`click`, scaleControlBiggerClickHandler);
    scaleControlSmaller.addEventListener(`click`, scaleControlSmallerClickHandler);

    uploadFile.removeEventListener(`change`, uploadFileChangeHandler);
  };

  var uploadFileChangeHandler = function () {
    openImgUpload();
  };

  var imgUploadCancelClickHandler = function () {
    closeImgUpload();
  };

  uploadFile.addEventListener(`change`, uploadFileChangeHandler);

  /* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
  // Обработка ползунка

  var effectLevelPin = imgUploadOverlay.querySelector(`.effect-level__pin`);
  var effectLevelValue = imgUploadOverlay.querySelector(`.effect-level__value`);
  var effectLevelLine = imgUploadOverlay.querySelector(`.effect-level__line`);
  var effectLevelDepth = imgUploadOverlay.querySelector(`.effect-level__depth`);

  /* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
  // Обработка смены фильтра
  var imgUploadPreview = imgUploadOverlay.querySelector(`.img-upload__preview`);
  var imgUploadPreviewImg = imgUploadPreview.querySelector(`img`);
  var imgUploadEffectLevel = imgUploadOverlay.querySelector(`.img-upload__effect-level`);
  var effectsList = imgUploadOverlay.querySelector(`.effects__list`);
  var effectsItems = effectsList.querySelectorAll(`.effects__item`);
  var effectnone = effectsList.querySelector(`#effect-none`);
  var newFilterValue;

  var effectsItemChangeHandler = function (evt) {
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

  var effectLevelPinMousedownHandler = function (downEvt) {
    downEvt.preventDefault();

    var startCoords = {
      x: downEvt.clientX,
    };

    var currentPosition = parseInt(effectLevelPin.style.left, 10) || 0;
    var effectLevelLineWidth = effectLevelLine.getBoundingClientRect().width;

    var documentMouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
      };

      var newPosition = currentPosition - shift.x;

      if (newPosition < 0) {
        newPosition = 0;
      } else if (newPosition > effectLevelLineWidth) {
        newPosition = effectLevelLineWidth;
      }

      effectLevelPin.style.left = newPosition + `px`;
      effectLevelDepth.style.width = newPosition + `px`;

      effectLevelValue.value = Math.round(100 * (newPosition / effectLevelLineWidth));
      var proportion = effectLevelValue.value / 100;

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
          imgUploadPreviewImg.style = `filter: blur(${proportion * 3}px)`;
          break;
        case `heat`:
          imgUploadPreviewImg.style = `filter: brightness(${proportion * 3})`;
          break;
      }
    };

    var documentMouseupHandler = function (upEvt) {
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

  var textHashtagsInputHandler = function (evt) {
    var validationRules = /(^|\B)#(?![0-9_]+\b)([a-zA-Z0-9_]{1,20})(\b|\r)/gi;
    if (validationRules.test(evt.target.value)) {
      textHashtags.setCustomValidity(``);
    } else {
      textHashtags.setCustomValidity(`Такой хэштег невозможен`);
    }
  };
  textHashtags.addEventListener(`input`, textHashtagsInputHandler);

  /* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
  // Масштабирование
  var scaleControlSmaller = imgUploadOverlay.querySelector(`.scale__control--smaller`);
  var scaleControlBigger = imgUploadOverlay.querySelector(`.scale__control--bigger`);
  var scaleControlValue = imgUploadOverlay.querySelector(`.scale__control--value`);

  var scaleControlSmallerClickHandler = function () {
    var currentScale = Number(scaleControlValue.value.substring(0, scaleControlValue.value.length - 1));
    if (currentScale >= 50) {
      scaleControlValue.value = (currentScale - 25) + `%`;
    }
    changeScale();
  };

  var scaleControlBiggerClickHandler = function () {
    var currentScale = Number(scaleControlValue.value.substring(0, scaleControlValue.value.length - 1));
    if (currentScale <= 75) {
      scaleControlValue.value = (currentScale + 25) + `%`;
    }
    changeScale();
  };

  var changeScale = function () {
    var currentScale = Number(scaleControlValue.value.substring(0, scaleControlValue.value.length - 1));
    var scaleProportion = currentScale / 100;
    imgUploadPreviewImg.style = `transform: scale(${scaleProportion});`;
  };

  /* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
  // Обработка отправки формы

  var successClickHandler = function (evt) {
    var successInner = document.querySelector(`.success__inner`);
    if (evt.target !== successInner) {
      closeSuccessWindow();
    }
  };

  var openSuccessWindow = function () {
    var success = document.querySelector(`.success`);
    var successButton = document.querySelector(`.success__button`);
    successButton.addEventListener(`click`, successButtonClickHandler);
    document.addEventListener(`keydown`, window.preview.documentKeydownHandler);
    success.addEventListener(`click`, successClickHandler);
  };

  var successButtonClickHandler = function () {
    closeSuccessWindow();
  };

  var closeSuccessWindow = function () {
    var success = document.querySelector(`.success`);
    success.parentNode.removeChild(success);
    document.removeEventListener(`keydown`, window.preview.documentKeydownHandler);
  };

  var formSuccessHandler = function () {
    var successTemplate = document.querySelector(`#success`)
      .content
      .querySelector(`.success`);

    var successWindow = successTemplate.cloneNode(true);
    main.appendChild(successWindow);
    openSuccessWindow();
  };

  var closeErrorWindow = function () {
    var error = document.querySelector(`.error`);
    error.parentNode.removeChild(error);
    document.removeEventListener(`keydown`, window.preview.documentKeydownHandler);
  };

  var errorButtonClickHandler = function () {
    closeErrorWindow();
  };

  var errorClickHandler = function (evt) {
    var errorInner = document.querySelector(`.error__inner`);
    if (evt.target !== errorInner) {
      closeErrorWindow();
    }
  };

  var openErrorWindow = function () {
    var errorButton = document.querySelector(`.error__button`);
    var error = document.querySelector(`.error`);
    errorButton.addEventListener(`click`, errorButtonClickHandler);
    document.addEventListener(`keydown`, window.preview.documentKeydownHandler);
    error.addEventListener(`click`, errorClickHandler);
  };

  var formErrorHandler = function () {
    var errorTemplate = document.querySelector(`#error`)
      .content
      .querySelector(`.error`);

    var errorWindow = errorTemplate.cloneNode(true);
    main.appendChild(errorWindow);
    openErrorWindow();
  };

  imgUploadForm.addEventListener(`submit`, function (evt) {
    window.backend.saveForm(new FormData(imgUploadForm), formSuccessHandler, formErrorHandler);
    closeImgUpload();
    evt.preventDefault();
  });

  window.form = {
    textDescription,
    textHashtags,
    closeImgUpload,
    closeSuccessWindow,
  };

})();
