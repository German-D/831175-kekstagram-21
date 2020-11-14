'use strict';

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
var page = 0;
var limit = 5;

var openPhoto = function (currentPhoto) {
  allCurrentComments = currentPhoto.comments;

  // Обогощаю картинку и форму данными
  bigPictureImg.src = currentPhoto.url;
  likesCount.textContent = currentPhoto.likes;
  commentsCount.textContent = currentPhoto.comments.length;

  page = 0;

  commentsLoaderClickHandler();
  if (currentPhoto.comments.length > 5) {
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
  for (var i = page * limit; i < (page + 1) * limit && i < allCurrentComments.length; i++) {

    var item = allCurrentComments[i];

    var newComment = socialComment.cloneNode(true);
    var socialPicture = newComment.querySelector(`.social__picture`);
    var socialText = newComment.querySelector(`.social__text`);
    socialPicture.src = item.avatar;
    socialPicture.alt = item.name;
    socialText.textContent = item.message;
    newCommentsList.appendChild(newComment);
  }

  page++;

  var socialCommentCollection = document.querySelectorAll(`.social__comment`);
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
