'use strict';
(function () {

  var getRandomNumberInRange = function (min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  };

  // Скопипастил лучшее решение для перемешивания массива со stackoverflow
  var shuffle = function (array) {
    var list = array.slice();
    var m = list.length;
    var temp;
    var j;

    // Check if there's still elements remaining
    while (m) {

      // Pick remaining element
      j = Math.floor(Math.random() * m--);

      // Swap it with the current element
      temp = list[m];
      list[m] = list[j];
      list[j] = temp;
    }

    return list;
  };

  /* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
  var getAllComments = function (commentsQuantity) {
    var allComments = [];

    // В зависимости от константы кол-ва комментариев — создаю массив с коментариями
    for (var j = 0; j < commentsQuantity; j++) {
      allComments.push({
        avatar: `img/avatar-` + getRandomNumberInRange(window.data.AVATAR_RANDOM_START, window.data.AVATAR_RANDOM_FINISH) + `.svg`,
        message: getMessages(window.data.allMessages),
        name: window.data.allNames[getRandomNumberInRange(window.data.NAME_RANDOM_START, window.data.NAME_RANDOM_FINISH)]
      });
    }
    return allComments;
  };

  /* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
  var getMessages = function (messagesArray) {
    var messagesQuantity = getRandomNumberInRange(window.data.MESSAGE_RANDOM_START, window.data.MESSAGE_RANDOM_FINISH);
    return shuffle(messagesArray).slice(0, messagesQuantity).join(` `);
  };

  /* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
  // Создаю массив из фотографий
  var getAllPhotos = function (photoQuantity) {
    var allPhotos = [];

    for (var i = 1; i <= photoQuantity; i++) {
      allPhotos.push({
        url: `photos/${i}.jpg`,
        description: `Описание фотографии`,
        likes: getRandomNumberInRange(window.data.LIKES_RANDOM_START, window.data.LIKES_RANDOM_FINISH),
        comments: getAllComments(window.data.COMMENTS_RANDOM_QUANTITY),
      });
    }
    return allPhotos;
  };


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
  };

  var photoList = getAllPhotos(window.data.MAIN_PHOTOS_QUANTITY);
  renderAllPhotos(photoList);

  window.gallery = {
    photoList,
  };
})();
