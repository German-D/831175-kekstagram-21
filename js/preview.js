'use strict';
(function () {

  var body = document.querySelector(`body`);

  // Отрисовываем большую картинку
  var socialFooterText = document.querySelector(`.social__footer-text`);
  var bigPicture = document.querySelector(`.big-picture`);
  var bigPictureCancel = bigPicture.querySelector(`.big-picture__cancel`);

  var bigPictureCancelClickhandler = function () {
    closeBigPhoto();
  };

  var documentKeydownHandler = function (evt) {
    console.log(evt);
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
      window.form.closeSuccessWindow();
    }
  };

  var openPhoto = function (currentPhoto) {
    var bigPictureImgDiv = bigPicture.querySelector(`.big-picture__img`);
    var bigPictureImg = bigPictureImgDiv.querySelector(`img`);
    var likesCount = bigPicture.querySelector(`.likes-count`);
    var socialCommentCount = bigPicture.querySelector(`.social__comment-count`);
    var commentsLoader = bigPicture.querySelector(`.comments-loader`);
    var commentsCount = bigPicture.querySelector(`.comments-count`);
    var socialComments = bigPicture.querySelector(`.social__comments`);
    var socialComment = socialComments.querySelector(`.social__comment`);
    var newCommentsList = socialComments.cloneNode(false);

    // Обогощаю картинку и форму данными
    bigPictureImg.src = currentPhoto.url;
    likesCount.textContent = currentPhoto.likes;
    commentsCount.textContent = currentPhoto.comments.length;

    currentPhoto.comments.forEach(function (item) {
      var newComment = socialComment.cloneNode(true);
      var socialPicture = newComment.querySelector(`.social__picture`);
      var socialText = newComment.querySelector(`.social__text`);
      socialPicture.src = item.avatar;
      socialPicture.alt = item.name;
      socialText.textContent = item.message;
      newCommentsList.appendChild(newComment);
    });

    body.classList.add(`modal-open`);
    socialComments.replaceWith(newCommentsList);
    socialCommentCount.classList.add(`hidden`);
    commentsLoader.classList.add(`hidden`);
    bigPicture.classList.remove(`hidden`);

    document.addEventListener(`keydown`, documentKeydownHandler);
    bigPictureCancel.addEventListener(`click`, bigPictureCancelClickhandler);

  };

  /* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
  // Закрываем большую картинку

  var closeBigPhoto = function () {
    bigPicture.classList.add(`hidden`);

    document.removeEventListener(`keydown`, documentKeydownHandler);
    bigPictureCancel.removeEventListener(`click`, bigPictureCancelClickhandler);

    body.classList.remove(`modal-open`);

  };

  window.preview = {
    body,
    documentKeydownHandler,
    openPhoto,
  };
})();
