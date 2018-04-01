const responses = [
    /* eslint-disable max-len */
    'Hi this is Pack Buddy!. With me, your packing experience will not be boring anymore!',
    'Hey this is me, Pack Buddy. My sole purpose it to make your packing experience better',
    'With Pack Buddy as your buddy, You will never get bored packing!',
];

module.exports = () => responses[Math.floor((Math.random() * 1337)) % responses.length];
