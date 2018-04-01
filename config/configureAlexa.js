const Alexa = require('alexa-sdk');
const constants = require('../config/constants');
const handlers = require('../src/intent-handlers/index');

module.exports = (event, context, callback) => {
    const alexa = Alexa.handler(event, context, callback);
    alexa.appId = constants.ALEXA.APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
