'use strict';

var LOAD_URL = `https://21.javascript.pages.academy/kekstagram/data`;
var SAVE_URL = `https://21.javascript.pages.academy/kekstagram`;
var MAX_RANDOM_COUNT = 10;

var TIMEOUT_IN_MS = 10000;

var StatusCode = {
  OK: 200
};

var loadPhotos = function (onSuccess, onError, type) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, function () {
    if (xhr.status === StatusCode.OK) {
      switch (type) {
        case `random`:
          var randomResponse = window.utils.shuffle(xhr.response);
          onSuccess(randomResponse.slice(0, MAX_RANDOM_COUNT));
          break;
        case `discussed`:
          var discussedResponse = xhr.response.sort(function (a, b) {
            return b.comments.length - a.comments.length;
          });
          onSuccess(discussedResponse);
          break;
        default: onSuccess(xhr.response);
      }
    } else {
      onError(`Статус ответа: ` + xhr.status + ` ` + xhr.statusText);
    }
  });

  xhr.addEventListener(`error`, function () {
    onError(`Произошла ошибка соединения`);
  });

  xhr.addEventListener(`timeout`, function () {
    onError(`Запрос не успел выполниться за ` + xhr.timeout + `мс`);
  });

  xhr.timeout = TIMEOUT_IN_MS;

  xhr.open(`GET`, LOAD_URL);
  xhr.send();
};

var saveForm = function (data, onSuccess, onError) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = `json`;

  xhr.addEventListener(`load`, function () {
    if (xhr.status === StatusCode.OK) {
      onSuccess();
    } else {
      onError();
    }
  });

  xhr.open(`POST`, SAVE_URL);
  xhr.send(data);
};

window.backend = {
  loadPhotos,
  saveForm,
};
