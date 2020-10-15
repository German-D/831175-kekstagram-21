'use strict';
var body = document.querySelector(`body`);

var AVATAR_RANDOM_START = 1;
var AVATAR_RANDOM_FINISH = 6;

var NAME_RANDOM_START = 0;
var NAME_RANDOM_FINISH = 6;

var MESSAGE_RANDOM_START = 1;
var MESSAGE_RANDOM_FINISH = 2;

var LIKES_RANDOM_START = 15;
var LIKES_RANDOM_FINISH = 200;

var COMMENTS_RANDOM_QUANTITY = 4;

var MAIN_PHOTOS_QUANTITY = 25;

// Для больше деталей (часть 2) нужно захаркодить номер фото, которая будет вначале открываться
var BIG_IMG_PHOTO_POSITION = 0;

var allNames = [
  `Дима`,
  `Андрей`,
  `Майрам`,
  `Лена`,
  `Иван`,
  `Герман`,
  `Магомед`,
];

var allMessages = [
  `Всё отлично!`,
  `В целом всё неплохо. Но не всё.`,
  `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
  `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
  `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
  `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`,
];

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
      avatar: `img/avatar-` + getRandomNumberInRange(AVATAR_RANDOM_START, AVATAR_RANDOM_FINISH) + `.svg`,
      message: getMessages(allMessages),
      name: allNames[getRandomNumberInRange(NAME_RANDOM_START, NAME_RANDOM_FINISH)]
    });
  }
  return allComments;
};

/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
var getMessages = function (messagesArray) {
  var messagesQuantity = getRandomNumberInRange(MESSAGE_RANDOM_START, MESSAGE_RANDOM_FINISH);
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
      likes: getRandomNumberInRange(LIKES_RANDOM_START, LIKES_RANDOM_FINISH),
      comments: getAllComments(COMMENTS_RANDOM_QUANTITY),
    });
  }
  return allPhotos;
};


/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Отрисовка фотографий

var renderPhoto = function (photo) {
  var pictureTemplate = document.querySelector(`#picture`)
    .content
    .querySelector(`.picture`);

  var photoElement = pictureTemplate.cloneNode(true);
  var photoUrl = photoElement.querySelector(`.picture__img`);
  var photoLikes = photoElement.querySelector(`.picture__likes`);
  var photoComments = photoElement.querySelector(`.picture__comments`);

  photoUrl.src = photo.url;
  photoLikes.textContent = photo.likes;
  photoComments.textContent = photo.comments.length;

  return photoElement;
};

var renderAllPhotos = function (photos) {
  var similarPhotoElement = document.querySelector(`.pictures`);
  var fragment = document.createDocumentFragment();

  photos.forEach(function (item, i) {
    var newPhoto = renderPhoto(photos[i]);
    fragment.appendChild(newPhoto);
  });

  similarPhotoElement.appendChild(fragment);
};

var photoList = getAllPhotos(MAIN_PHOTOS_QUANTITY);
renderAllPhotos(photoList);

/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// отрисовываем большую картинку

var openPhoto = function (currentPhoto) {
  body.classList.add(`modal-open`);
  var bigPicture = document.querySelector(`.big-picture`);
  var bigPictureImgDiv = bigPicture.querySelector(`.big-picture__img`);
  var bigPictureImg = bigPictureImgDiv.querySelector(`img`);
  var likesCount = bigPicture.querySelector(`.likes-count`);
  var socialCommentCount = bigPicture.querySelector(`.social__comment-count`);
  var commentsLoader = bigPicture.querySelector(`.comments-loader`);
  var commentsCount = bigPicture.querySelector(`.comments-count`);
  var socialComments = bigPicture.querySelector(`.social__comments`);
  var socialComment = socialComments.querySelector(`.social__comment`);
  var newCommentsList = socialComments.cloneNode(false);

  // Обогощаю картинкуи форму данными
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

  socialComments.replaceWith(newCommentsList);
  socialCommentCount.classList.add(`hidden`);
  commentsLoader.classList.add(`hidden`);
  bigPicture.classList.remove(`hidden`);
};

openPhoto(photoList[BIG_IMG_PHOTO_POSITION]);
