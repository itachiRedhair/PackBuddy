'use strict';

const Alexa = require("alexa-sdk");

//helper function imports
const initializePackingSession = require("./../utilities/packingListController").setPackingSession;
const resetRemindMePackingList = require("./../utilities/packingListController").resetRemindMePackingList;
const getIncompleteTripDetails = require("./../utilities/tripListController").getIncompleteTripDetails;
var clearState = require("./../utilities/helper").clearState;

//constants imports
const states = require("./../constants").states;
const session = require("./../constants").session;
const packingStatus = require("./../constants").packingStatus;
const intents = require("./../constants").intents;
const messages = require("./../messages");


//handler functions
const newSessionHandler = function () {

    if (this.event.request.type === "IntentRequest") {
        switch (this.event.request.intent.name) {
            case intents.StartNewPackingIntent:
                this.emit(intents.StartNewPackingIntent);
            case intents.ResumeOldPackingIntent:
                this.emit(intents.ResumeOldPackingIntent);
            case intents.IncompleteTripIntent:
                this.emit(intents.IncompleteTripIntent);
            case intents.ListInvokeIntent:
                this.emit(intents.IncompleteTripIntent);
        }
    }

    if (Object.keys(this.attributes).length === 0) {
        //if it's the first time the skill has been invoked
    }

    let userId = this.event.session.user.userId;
    getIncompleteTripDetails(userId).then(incompleteTripDetails => {
        console.log('in newsessionhandler incompletripdetails->', incompleteTripDetails);
        if (incompleteTripDetails !== null) {
            this.response.speak(messages.GREETING + " " + messages.START_QUESTION_WITH_REMINDER)
                .listen(messages.START_QUESTION_WITH_REMINDER);
            this.emit(':responseReady');
        } else {
            this.handler.state = states.NEW_TRIP;
            this.response.speak(messages.GREETING + " " + messages.START_QUESTION)
                .listen(messages.START_QUESTION);
            this.emit(':responseReady');
        }
    }).catch(err => {
        console.log(err);
    });
}

const incompleteTripHandler = function () {
    console.log('here in incomplete trip intent');
    // this.attributes[session.CURRENT_TOTAL_PACKING_STATUS]=packingStatus.STARTED;
    let userId = this.event.session.user.userId;
    getIncompleteTripDetails(userId).then(tripDetails => {
        if (!tripDetails || tripDetails === null || Object.keys(tripDetails).length === 0) {
            console.log('emmiting newssion from incomplete trip handler');
            this.emit(intents.NewSession);
        }
        console.log('restiing and startin categoryselect handler');
        initializePackingSession.call(this, tripDetails);
        resetRemindMePackingList.call(this);
        this.handler.state = states.CATEGORY_SELECT;
        this.emitWithState(intents.NewSession);
    });
}

const startNewPackingHandler = function () {
    console.log('here in start new packing intent');
    this.handler.state = states.NEW_TRIP;
    this.emitWithState(intents.NewSession)
}

const resumeOldPackingHandler = function () {

    let userId = this.event.session.user.userId;

    getIncompleteTripDetails(userId).then(tripDetails => {
        if (!tripDetails || tripDetails === null || Object.keys(tripDetails).length === 0) {
            console.log('emmiting newssion from resume old packing handler');
            this.emit(intents.NewSession);
        }

        console.log('restiing and startin categoryselect handler');
        initializePackingSession.call(this, tripDetails);
        this.handler.state = states.CATEGORY_SELECT;

        console.log('in resume old packing, selected_category=>', tripDetails.selected_category);

        if (tripDetails.selected_category !== 'null') {
            this.attributes[session.CURRENT_PACKING_CATEGORY_KEY] = tripDetails.selected_category;
            this.emitWithState(intents.StartSelectedCategoryIntent);
        } else {
            this.attributes[session.CURRENT_PACKING_CATEGORY_KEY] = 'null';
            this.emitWithState(intents.NewSession);
        }

    });
}

const stopHandler = function () {
    this.response.speak(messages.NEW_SESSION_STOP);
    this.emit(":responseReady");
}

const unhandledHandler = function () {
    clearState.call(this);
    this.emit(intents.NewSession);
}


//handlers initialization
let newSessionHandlers = {};

newSessionHandlers[intents.NewSession] = newSessionHandler;
newSessionHandlers[intents.IncompleteTripIntent] = incompleteTripHandler;
newSessionHandlers[intents.StartNewPackingIntent] = startNewPackingHandler;
newSessionHandlers[intents.ResumeOldPackingIntent] = resumeOldPackingHandler;
newSessionHandlers[intents.AMAZON.StopIntent] = stopHandler;
newSessionHandlers[intents.Unhandled] = unhandledHandler;

module.exports = newSessionHandlers;