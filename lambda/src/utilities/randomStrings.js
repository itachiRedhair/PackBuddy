'use strict';

var strings = {
    packPrompt: [
        "Let's pack",
        "Now pack",
        "Pack your"
    ]
}

function getRandomString(type) {
    let max = strings[type].length;
    var randomNumber = Math.floor(Math.random() * (max));
    return strings[type][randomNumber];
}

module.exports = { getRandomString }