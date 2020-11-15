'use strict';

const LIMIT = 5;
const body = document.querySelector(`body`);

// Отрисовываем большую картинку
const socialFooterText = document.querySelector(`.social__footer-text`);
const bigPicture = document.querySelector(`.big-picture`);
const bigPictureCancel = bigPicture.querySelector(`.big-picture__cancel`);
const commentsLoader = bigPicture.querySelector(`.comments-loader`);
commentsLoader.classList.add(`hidden`);

const bigPictureCancelClickHandler = () => {
  closeBigPhoto();
};

const documentKeydownHandler = (evt) => {
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

    if (document.querySelector(`.error`)) {
      window.form.closeErrorWindow();
    }
  }
};

let allCurrentComments;
let page = 0;
const bigPictureImgDiv = bigPicture.querySelector(`.big-picture__img`);
const bigPictureImg = bigPictureImgDiv.querySelector(`img`);
const likesCount = bigPicture.querySelector(`.likes-count`);
const socialCommentCount = bigPicture.querySelector(`.social__comment-count`);
const commentsCount = bigPicture.querySelector(`.comments-count`);
const socialComments = bigPicture.querySelector(`.social__comments`);
const socialComment = socialComments.querySelector(`.social__comment`);
const newCommentsList = socialComments.cloneNode(false);

const renderComments = () => {
  for (let i = page * LIMIT; i < (page + 1) * LIMIT && i < allCurrentComments.length; i++) {

    const item = allCurrentComments[i];

    const newComment = socialComment.cloneNode(true);
    const socialPicture = newComment.querySelector(`.social__picture`);
    const socialText = newComment.querySelector(`.social__text`);
    socialPicture.src = item.avatar;
    socialPicture.alt = item.name;
    socialText.textContent = item.message;
    newCommentsList.appendChild(newComment);
  }

  page++;
};

const openPhoto = (currentPhoto) => {
  allCurrentComments = currentPhoto.comments;

  // Обогощаю картинку и форму данными
  bigPictureImg.src = currentPhoto.url;
  likesCount.textContent = currentPhoto.likes;
  commentsCount.textContent = currentPhoto.comments.length;

  page = 0;

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

const commentsLoaderClickHandler = () => {
  renderComments();
  const socialCommentCollection = document.querySelectorAll(`.social__comment`);
  if (socialCommentCollection.length === allCurrentComments.length) {
    hideButtonMoreComments();
  }

};

const showButtonMoreComments = () => {
  commentsLoader.classList.remove(`hidden`);
  commentsLoader.addEventListener(`click`, commentsLoaderClickHandler);
};

const hideButtonMoreComments = () => {
  commentsLoader.classList.add(`hidden`);
  commentsLoader.removeEventListener(`click`, commentsLoaderClickHandler);
};

/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Закрываем большую картинку

const closeBigPhoto = () => {
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
