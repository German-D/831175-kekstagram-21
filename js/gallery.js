'use strict';
(function () {
  /* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
  // Отрисовка фотографий

  var renderPhoto = function (photo, i) {
    var pictureTemplate = document.querySelector(`#picture`)
    .content
    .querySelector(`.picture`);

    var photoElement = pictureTemplate.cloneNode(true);
    var photoUrl = photoElement.querySelector(`.picture__img`);
    var photoLikes = photoElement.querySelector(`.picture__likes`);
    var photoComments = photoElement.querySelector(`.picture__comments`);

    photoUrl.setAttribute(`data-index`, i);
    photoUrl.src = photo.url;
    photoLikes.textContent = photo.likes;
    photoComments.textContent = photo.comments.length;

    return photoElement;
  };

  var renderAllPhotos = function (photos) {
    var similarPhotoElement = document.querySelector(`.pictures`);
    var fragment = document.createDocumentFragment();

    photos.forEach(function (item, i) {
      var newPhoto = renderPhoto(photos[i], i);
      fragment.appendChild(newPhoto);
    });

    similarPhotoElement.appendChild(fragment);

    // Сразу добавляю обработчик на клик для каждой картинки
    var photosCollection = document.querySelectorAll(`.picture`);

    var photosListClickHandler = function (i) {
      window.preview.openPhoto(photos[i]);
    };

    photosCollection.forEach(function (item, i) {
      item.addEventListener(`click`, function () {
        photosListClickHandler(i);
      });
    });
  };

  var successHandler = function (photos) {
    renderAllPhotos(photos);
  };

  var errorHandler = function (errorMessage) {
    var node = document.createElement(`div`);
    node.style = `z-index: 100; margin: 0 auto; text-align: center; background-color: red;`;
    node.style.position = `absolute`;
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = `30px`;

    node.textContent = errorMessage;
    document.body.insertAdjacentElement(`afterbegin`, node);
  };

  window.backend.loadPhotos(successHandler, errorHandler);
})();
