'use strict';
(function () {

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

  window.data = {
    AVATAR_RANDOM_START,
    AVATAR_RANDOM_FINISH,
    NAME_RANDOM_START,
    NAME_RANDOM_FINISH,
    MESSAGE_RANDOM_START,
    MESSAGE_RANDOM_FINISH,
    LIKES_RANDOM_START,
    LIKES_RANDOM_FINISH,
    COMMENTS_RANDOM_QUANTITY,
    MAIN_PHOTOS_QUANTITY,
    allNames,
    allMessages,
  };
})();
