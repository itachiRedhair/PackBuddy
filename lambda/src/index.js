'use strict';
var Alexa = require("alexa-sdk");
var AWS = require('aws-sdk');
var languageStrings = require('./strings');
var constants = require("./constants")
//handlers import
var newSessionHandler = require("./handlers/newSessionHandler");
var newTripModeHandler = require("./handlers/newTripModeHandler");
var packBagHandler = require("./handlers/packBagHandler");
var categorySelectHandler = require("./handlers/categorySelectHandler");

//setting environment variable
var env = process.env.NODE_ENV || 'development';


//handler function
exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.resources = languageStrings;
    alexa.appId = constants.appId;

    if(env === 'development') {
        var config = {
            "apiVersion": "2012-08-10",
            "accessKeyId": "abcde",
            "secretAccessKey": "abcde",
            "region":"us-east-1",
            "endpoint": "http://localhost:3333"
        }
        alexa.dynamoDBClient =new AWS.DynamoDB(config);  
    }

    // alexa.dynamoDBTableName = constants.sessionTable; // Dafuq really? That's it?
    alexa.registerHandlers(
        newSessionHandler,
        newTripModeHandler,
        packBagHandler,
        categorySelectHandler
    );
    alexa.execute();
};



var handler = {
    'LaunchRequest': function () {
        // console.log('in Launch Request in index.js');
        this.handler.state = constants.states.LAUNCH;
        this.emitWithState("LaunchRequest");
    },
    'SessionEndedRequest': function () {
        // this.handler.state = states.LAUNCH;
        this.emit(':saveState', true);
        // console.log('Session ended with reason: ' + this.event.request.reason);
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