const responses = [
    /* eslint-disable max-len */
    'Alright! Let me help you pack for your new trip!',
    'Great! Let me help you pack',
    'Okay let\'s start packing!',
];

module.exports = () => responses[Math.floor((Math.random() * 1337)) % responses.length];
