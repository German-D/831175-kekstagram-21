'use strict';

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

window.utils = {
  shuffle,
};

