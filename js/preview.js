'use strict';
var PAGE = 0;
var LIMIT = 5;
var body = document.querySelector(`body`);

// Отрисовываем большую картинку
var socialFooterText = document.querySelector(`.social__footer-text`);
var bigPicture = document.querySelector(`.big-picture`);
var bigPictureCancel = bigPicture.querySelector(`.big-picture__cancel`);
var commentsLoader = bigPicture.querySelector(`.comments-loader`);
commentsLoader.classList.add(`hidden`);

var bigPictureCancelClickHandler = function () {
  closeBigPhoto();
};

var documentKeydownHandler = function (evt) {
  if (evt.key === `Escape`) {
    if (evt.target === window.form.textHashtags) {
      return;
    }
    if (evt.target === window.form.textDescription) {
      return;
    }
    if (evt.target === socialFooterText) {
      return;
    }
    closeBigPhoto();
    window.form.closeImgUpload();

    if (document.querySelector(`.success`)) {
      window.form.closeSuccessWindow();
    }
  }
};

var allCurrentComments;
var bigPictureImgDiv = bigPicture.querySelector(`.big-picture__img`);
var bigPictureImg = bigPictureImgDiv.querySelector(`img`);
var likesCount = bigPicture.querySelector(`.likes-count`);
var socialCommentCount = bigPicture.querySelector(`.social__comment-count`);
var commentsCount = bigPicture.querySelector(`.comments-count`);
var socialComments = bigPicture.querySelector(`.social__comments`);
var socialComment = socialComments.querySelector(`.social__comment`);
var newCommentsList = socialComments.cloneNode(false);

var renderComments = function () {
  for (let i = PAGE * LIMIT; i < (PAGE + 1) * LIMIT && i < allCurrentComments.length; i++) {

    let item = allCurrentComments[i];

    let newComment = socialComment.cloneNode(true);
    let socialPicture = newComment.querySelector(`.social__picture`);
    let socialText = newComment.querySelector(`.social__text`);
    socialPicture.src = item.avatar;
    socialPicture.alt = item.name;
    socialText.textContent = item.message;
    newCommentsList.appendChild(newComment);
  }

  PAGE++;
};

var openPhoto = function (currentPhoto) {
  allCurrentComments = currentPhoto.comments;

  // Обогощаю картинку и форму данными
  bigPictureImg.src = currentPhoto.url;
  likesCount.textContent = currentPhoto.likes;
  commentsCount.textContent = currentPhoto.comments.length;

  PAGE = 0;

  renderComments();
  if (currentPhoto.comments.length > LIMIT) {
    showButtonMoreComments();
  }

  body.classList.add(`modal-open`);
  socialComments.replaceWith(newCommentsList);
  socialCommentCount.classList.add(`hidden`);
  bigPicture.classList.remove(`hidden`);

  document.addEventListener(`keydown`, documentKeydownHandler);
  bigPictureCancel.addEventListener(`click`, bigPictureCancelClickHandler);
};

/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Добавляю новые комментарии

var commentsLoaderClickHandler = function () {
  renderComments();
  let socialCommentCollection = document.querySelectorAll(`.social__comment`);
  if (socialCommentCollection.length === allCurrentComments.length) {
    hideButtonMoreComments();
  }

};

var showButtonMoreComments = function () {
  commentsLoader.classList.remove(`hidden`);
  commentsLoader.addEventListener(`click`, commentsLoaderClickHandler);
};

var hideButtonMoreComments = function () {
  commentsLoader.classList.add(`hidden`);
  commentsLoader.removeEventListener(`click`, commentsLoaderClickHandler);
};

/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Закрываем большую картинку

var closeBigPhoto = function () {
  newCommentsList.innerHTML = ``;
  bigPicture.classList.add(`hidden`);
  document.removeEventListener(`keydown`, documentKeydownHandler);
  bigPictureCancel.removeEventListener(`click`, bigPictureCancelClickHandler);
  body.classList.remove(`modal-open`);
};


window.preview = {
  body,
  documentKeydownHandler,
  openPhoto,
};
