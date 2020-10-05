'use strict';

var COMMENTS_QUANTITY = 4;

var getRandomNumberInRange = function (min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

var allMessages = [
  `Всё отлично!`,
  `В целом всё неплохо. Но не всё.`,
  `Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.`,
  `Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.`,
  `Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.`,
  `Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!`,
];

var allNames = [
  `Дима`,
  `Андрей`,
  `Майрам`,
  `Лена`,
  `Иван`,
  `Герман`,
  `Магомед`,
];


/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Создаю массив из фотографий
var allPhotos = [];

for (var i = 1; i < 26; i++) {

  // Определяю количетсво сообщений
  var messagesQuantity = getRandomNumberInRange(1, 2);

  // Пишу грязную функцию, потому что больше её не буду использовать.
  // В функции, в зависимости от значения messagesQuantity возвращаю один или два комментария
  var messeges = function () {
    if (messagesQuantity === 2) {
      return allMessages[getRandomNumberInRange(1, 6)] + ` ` + allMessages[getRandomNumberInRange(1, 6)];
    }
    return allMessages[getRandomNumberInRange(1, 6)];
  };

  var allComments = [];

  // В зависимости от константы кол-ва комментариев — создаю массив с коментариями
  for (var j = 0; j < COMMENTS_QUANTITY; j++) {
    allComments.push({
      avatar: `img/avatar-` + getRandomNumberInRange(1, 6) + `.svg`,
      message: messeges(),
      name: allNames[getRandomNumberInRange(1, 7)]
    });
  }

  allPhotos.push({
    url: `photos/` + i + `.jpg`,
    description: `Описание фотографии`,
    likes: getRandomNumberInRange(1, 25),
    comments: allComments,
  });
}

/* ++++++++++ ++++++++++ ++++++++++ ++++++++++ ++++++++++++++++++++ ++++++++++ */
// Отрисовка фотографий
var similarPhotoElement = document.querySelector(`.pictures`);

var renderPhoto = function (photo) {
  let pictureTemplate = document.querySelector(`#picture`)
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

  var fragment = document.createDocumentFragment();
  for (var k = 0; k < photos.length; k++) {
    var newPhoto = renderPhoto(photos[k]);
    fragment.appendChild(newPhoto);
  }

  similarPhotoElement.appendChild(fragment);
};

renderAllPhotos(allPhotos);
