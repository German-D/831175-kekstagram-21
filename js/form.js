'use strict';
(function () {
/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Обработка загрузки фото
  var imgUploadOverlay = document.querySelector(`.img-upload__overlay`);
  var imgUploadCancel = imgUploadOverlay.querySelector(`.img-upload__cancel`);
  var uploadFile = document.querySelector(`#upload-file`);

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
    imgUploadPreviewImg.classList = ``;
    scaleControlValue.value = `100%`;
    imgUploadPreviewImg.style = `transform: scale(1);`;
    effectLevelValue.value = ``;
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

  var effectsItemChangeHandler = function (evt) {
    imgUploadPreviewImg.classList = ``;
    effectLevelPin.style.left = effectLevelLine.getBoundingClientRect().width + `px`;
    effectLevelDepth.style.width = effectLevelLine.getBoundingClientRect().width + `px`;
    if (evt.target.value === `none`) {
      imgUploadEffectLevel.classList.add(`hidden`);
    } else {
      imgUploadEffectLevel.classList.remove(`hidden`);
    }
    effectLevelValue.value = ``;
    var newClass = `effects__preview--` + evt.target.value;
    imgUploadPreviewImg.classList.add(newClass);

    var effectLevelPinMousedownHandler = function (downEvt) {
      downEvt.preventDefault();

      var startCoords = {
        x: downEvt.clientX,
      };

      var documentMouseMoveHandler = function (moveEvt) {
        moveEvt.preventDefault();

        var shift = {
          x: startCoords.x - moveEvt.clientX,
        };

        startCoords = {
          x: moveEvt.clientX,
        };

        if (effectLevelPin.getBoundingClientRect().x < effectLevelLine.getBoundingClientRect().x) {
          effectLevelPin.style.left = 0 + `px`;
        }

        if (effectLevelPin.getBoundingClientRect().x > effectLevelLine.getBoundingClientRect().x + effectLevelLine.getBoundingClientRect().width) {
          effectLevelPin.style.left = effectLevelLine.getBoundingClientRect().width + `px`;
        }

        effectLevelPin.style.left = (effectLevelPin.offsetLeft - shift.x) + `px`;
        effectLevelDepth.style.width = (effectLevelPin.offsetLeft - shift.x) + `px`;

        var pinCoordinateX = moveEvt.target.getBoundingClientRect().x - effectLevelLine.getBoundingClientRect().x;
        var effectLevelWidth = effectLevelLine.getBoundingClientRect().width;
        effectLevelValue.value = Math.round(100 * (pinCoordinateX / effectLevelWidth));
        var proportion = effectLevelValue.value / 100;

        if (newClass === `effects__preview--chrome`) {
          imgUploadPreviewImg.style = `filter: grayscale(${proportion})`;
        }

        if (newClass === `effects__preview--sepia`) {
          imgUploadPreviewImg.style = `filter: sepia(${proportion})`;
        }

        if (newClass === `effects__preview--marvin`) {
          imgUploadPreviewImg.style = `filter: invert(${effectLevelValue.value}%)`;
        }

        if (newClass === `effects__preview--phobos`) {
          imgUploadPreviewImg.style = `filter: blur(${proportion * 3}px)`;
        }

        if (newClass === `effects__preview--heat`) {
          imgUploadPreviewImg.style = `filter: blur(${proportion * 3})`;
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
  };

  // Сбрасываю уровень эффекта при смене фильтра
  effectsItems.forEach(function (item) {
    item.addEventListener(`change`, effectsItemChangeHandler);
  });

  /* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
  // Валидация хеш-тегов и комментов
  var textDescription = imgUploadOverlay.querySelector(`.text__description`);
  var textHashtags = imgUploadOverlay.querySelector(`.text__hashtags`);

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

  window.form = {
    textDescription,
    textHashtags,
    closeImgUpload,
  };

})();
