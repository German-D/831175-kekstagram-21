'use strict';

var getRandomNumberInRange = function (min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

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


/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Создаю массив из фотографий
var gatAllPhotos = function (photoQuantity) {
  var allPhotos = [];

  for (var i = 1; i < photoQuantity; i++) {

    // Скопипастил лучшее решение для перемешивания массива со stackoverflow
    var shuffle = function (array) {
      array = array.slice();
      var m = array.length;
      var temp;
      var j;

      // Check if there's still elements remaining
      while (m) {

        // Pick remaining element
        j = Math.floor(Math.random() * m--);

        // Swap it with the current element
        temp = array[m];
        array[m] = array[j];
        array[j] = temp;
      }

      return array;
    };
    var messages = function (messagesArray) {
      return shuffle(messagesArray).slice(0, 2).join(` `);
    };


    var getAllComments = function (commentsQuantity) {

      var allComments = [];

      // В зависимости от константы кол-ва комментариев — создаю массив с коментариями
      for (var j = 0; j < commentsQuantity; j++) {
        allComments.push({
          avatar: `img/avatar-` + getRandomNumberInRange(1, 6) + `.svg`,
          message: messages(allMessages),
          name: allNames[getRandomNumberInRange(1, 7)]
        });
      }
      return allComments;
    };

    allPhotos.push({
      url: `photos/` + i + `.jpg`,
      description: `Описание фотографии`,
      likes: getRandomNumberInRange(1, 25),
      comments: getAllComments(4),
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

renderAllPhotos(gatAllPhotos(26));
