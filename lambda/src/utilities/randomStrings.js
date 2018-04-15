'use strict';


function getRandomString(stringArray) {
    let max = stringArray.length;
    var randomNumber = Math.floor(Math.random() * (max));
    return stringArray[randomNumber];
}

module.exports = { getRandomString }