'use strict';

/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Отрисовка фотографий
const imgFilters = document.querySelector(`.img-filters`);
const filterRandom = document.querySelector(`#filter-random`);
const filterDefault = document.querySelector(`#filter-default`);
const filterDiscussed = document.querySelector(`#filter-discussed`);
const pictureTemplate = document.querySelector(`#picture`)
  .content
  .querySelector(`.picture`);
const similarPhotoElement = document.querySelector(`.pictures`);

const renderPhoto = (photo, i) => {
  const photoElement = pictureTemplate.cloneNode(true);
  const photoUrl = photoElement.querySelector(`.picture__img`);
  const photoLikes = photoElement.querySelector(`.picture__likes`);
  const photoComments = photoElement.querySelector(`.picture__comments`);

  photoUrl.setAttribute(`data-index`, i);
  photoUrl.src = photo.url;
  photoLikes.textContent = photo.likes;
  photoComments.textContent = photo.comments.length;

  return photoElement;
};

const renderAllPhotos = (photos) => {
  const fragment = document.createDocumentFragment();

  photos.forEach(function (item, i) {
    const newPhoto = renderPhoto(photos[i], i);
    fragment.appendChild(newPhoto);
  });

  similarPhotoElement.appendChild(fragment);

  // Сразу добавляю обработчик на клик для каждой картинки
  const photosCollection = document.querySelectorAll(`.picture`);

  const photosListClickHandler = (i) => {
    window.preview.openPhoto(photos[i]);
  };

  photosCollection.forEach(function (item, i) {
    item.addEventListener(`click`, function () {
      photosListClickHandler(i);
    });
  });
};

const changeTypeSort = (photos) => {
  filterDefault.classList.remove(`img-filters__button--active`);
  filterRandom.classList.remove(`img-filters__button--active`);
  filterDiscussed.classList.remove(`img-filters__button--active`);

  const pictureCollection = document.querySelectorAll(`.picture`);
  pictureCollection.forEach(function (item) {
    item.remove();
  });
  renderAllPhotos(photos);
};

const bounceChangeSortType = window.debounce(changeTypeSort);

const successHandler = (photos) => {
  imgFilters.classList.remove(`img-filters--inactive`);
  bounceChangeSortType(photos);
  filterDefault.classList.add(`img-filters__button--active`);
};

const successHandlerRandom = (photos) => {
  bounceChangeSortType(photos);
  filterRandom.classList.add(`img-filters__button--active`);
};

const successHandlerDiscussed = (photos) => {
  bounceChangeSortType(photos);
  filterDiscussed.classList.add(`img-filters__button--active`);
};

const errorHandler = (errorMessage) => {
  const node = document.createElement(`div`);
  node.style = `z-index: 100; margin: 0 auto; text-align: center; background-color: red;`;
  node.style.position = `absolute`;
  node.style.left = 0;
  node.style.right = 0;
  node.style.fontSize = `30px`;

  node.textContent = errorMessage;
  document.body.insertAdjacentElement(`afterbegin`, node);
};

window.backend.loadPhotos(successHandler, errorHandler);

const filterDefaultClickHandler = () => {
  window.backend.loadPhotos(successHandler, errorHandler);
};

const filterRandomClickHandler = () => {
  window.backend.loadPhotos(successHandlerRandom, errorHandler, `random`);
};

const filterDiscussedClickHandler = () => {
  window.backend.loadPhotos(successHandlerDiscussed, errorHandler, `discussed`);
};
filterDefault.addEventListener(`click`, filterDefaultClickHandler);
filterRandom.addEventListener(`click`, filterRandomClickHandler);
filterDiscussed.addEventListener(`click`, filterDiscussedClickHandler);

window.gallery = {
  errorHandler,
};
