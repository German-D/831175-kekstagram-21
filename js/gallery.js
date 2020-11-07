'use strict';
(function () {
  /* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
  // Отрисовка фотографий
  var imgFilters = document.querySelector(`.img-filters`);
  var filterRandom = document.querySelector(`#filter-random`);
  var filterDefault = document.querySelector('#filter-default');
  var filterDiscussed = document.querySelector('#filter-discussed');

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

  var changeTypeSort = function (photos) {
    filterDefault.classList.remove('img-filters__button--active');
    filterRandom.classList.remove('img-filters__button--active');
    filterDiscussed.classList.remove('img-filters__button--active');

    var pictureCollecton = document.querySelectorAll('.picture');
    pictureCollecton.forEach(function (item) {
      item.remove();
    });
    renderAllPhotos(photos);
  };

  var successHandler = function (photos) {
    imgFilters.classList.remove(`img-filters--inactive`);
    window.debounce(changeTypeSort(photos));
    filterDefault.classList.add('img-filters__button--active');
  };

  var successHandlerRandom = function (photos) {
    window.debounce(changeTypeSort(photos));
    filterRandom.classList.add('img-filters__button--active');
  };

  var successHandlerDiscussed = function (photos) {
    window.debounce(changeTypeSort(photos));
    filterDiscussed.classList.add('img-filters__button--active');
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

  var filterDefaultClickhandler = function () {
    window.backend.loadPhotos(successHandler, errorHandler);
  };

  var filterRandomClickHandler = function () {
    window.backend.loadPhotos(successHandlerRandom, errorHandler, 'random');
  };

  var filterDiscussedClickHandler = function () {
    window.backend.loadPhotos(successHandlerDiscussed, errorHandler, 'discussed');
  };
  filterDefault.addEventListener('click', filterDefaultClickhandler);
  filterRandom.addEventListener(`click`, filterRandomClickHandler);
  filterDiscussed.addEventListener('click', filterDiscussedClickHandler);

  window.gallery = {
    errorHandler,
  };
})();
