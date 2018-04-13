'use strict';
const Alexa = require("alexa-sdk");
const AWS = require('aws-sdk');
// const languageStrings = require('./strings');
const constants = require("./constants");
//handlers import
const newSessionHandlers = require("./handlers/newSessionHandlers");
const newTripModeHandlers = require("./handlers/newTripModeHandlers");
const packBagHandlers = require("./handlers/packBagHandlers");
const categorySelectHandlers = require("./handlers/categorySelectHandlers");

//setting environment variable
const env = process.env.NODE_ENV || 'development';


//handler function
exports.handler = function (event, context) {
    var alexa = Alexa.handler(event, context);
    // alexa.resources = languageStrings;
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

    alexa.dynamoDBTableName = constants.sessionTable; // Dafuq really? That's it?
   
    alexa.registerHandlers(
        newSessionHandlers,
        newTripModeHandlers,
        packBagHandlers,
        categorySelectHandlers
    );
   
    alexa.execute();
};