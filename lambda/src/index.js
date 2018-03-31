'use strict';
var Alexa = require("alexa-sdk");
var languageStrings = require('./strings');

//handlers import
var launchIntents = require("./handlers/launchRequest");
var sayHelloIntent = require("./handlers/sayHelloIntent");

//handler function
exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.resources = languageStrings;
    alexa.appId = "amzn1.ask.skill.d8ab4426-66ca-4dfd-bd0d-7f2c02419413";
    alexa.dynamoDBTableName = 'packBuddyTable'; // Dafuq really? That's it?
    alexa.registerHandlers(handlers, launchIntents, sayHelloIntent);
    alexa.execute();
};

var handlers = {
    'SessionEndedRequest': function () {
        console.log('Session ended with reason: ' + this.event.request.reason);
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(this.t("Goodbye_MSG"));
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak("You can try: 'alexa, hello world' or 'alexa, ask hello world my" +
            " name is awesome Aaron'");
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Bye');
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        this.response.speak("Sorry, I didn't get that. You can try: 'alexa, hello world'" +
            " or 'alexa, ask hello world my name is awesome Aaron'");
    }
};
