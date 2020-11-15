'use strict';

// Скопипастил лучшее решение для перемешивания массива со stackoverflow
const shuffle = (array) => {
  let list = array.slice();
  let m = list.length;
  let temp;
  let j;

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

