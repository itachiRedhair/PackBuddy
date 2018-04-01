const responses = [
    /* eslint-disable max-len */
    'This is embaressing. I broke again. As a buddy, I would suggest you to try again',
    'And here I broke again. Please try again. Maybe after a while.',
];

module.exports = () => responses[Math.floor((Math.random() * 1337)) % responses.length];
