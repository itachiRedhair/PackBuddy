'use strict';
const Alexa = require("alexa-sdk");

//imports
const initializePackingSession = require("./../utilities/packingListController").setPackingSession;
const resetRemindMePackingList = require("./../utilities/packingListController").resetRemindMePackingList;
const getIncompleteTripDetails = require("./../utilities/tripListController").getIncompleteTripDetails;

var clearState = require("./../utilities/helper").clearState;

//constants imports
const states = require("./../constants").states;
const session = require("./../constants").session;
const packingStatus = require("./../constants").packingStatus;

const newSessionHandlers = {
    'NewSession': function () {
        if (Object.keys(this.attributes).length === 0) {
            //if it's the first time the skill has been invoked
        }
        let userId = this.event.session.user.userId;
        getIncompleteTripDetails(userId).then(incompleteTripDetails => {
            console.log('in newsessionhandler incompletripdetails->', incompleteTripDetails);
            if (incompleteTripDetails !== null) {
                let message = 'It seems you are not done with your last packing? Do you want to resume it or start with the new one?'
                this.response.speak('Hi I am Pack Buddy. ' + message)
                    .listen(message);
                this.emit(':responseReady');
            } else {
                this.handler.state = states.NEW_TRIP;
                this.response.speak('Hi I am Pack Buddy. Do you want help with packing?')
                    .listen('Do you need help with packing?');
                this.emit(':responseReady');
            }
        }).catch(err => {
            console.log(err);
        });
    },

    'IncompleteTripIntent': function () {
        console.log('here in incomplete trip intent');
        // this.attributes[session.CURRENT_TOTAL_PACKING_STATUS]=packingStatus.STARTED;
        let userId = this.event.session.user.userId;        
        getIncompleteTripDetails(userId).then(tripDetails => {
            initializePackingSession.call(this, tripDetails);
            resetRemindMePackingList.call(this);
            this.handler.state = states.CATEGORY_SELECT;
            this.emitWithState("NewSession");
        });
    },

    'StartNewPackingIntent': function () {
        console.log('here in start new packing intent');
        this.handler.state = states.NEW_TRIP;
        this.emitWithState('NewSession')
    },

    'ResumeOldPackingIntent': function () {
        console.log('here in resuem old packing intent');
        this.emit("IncompleteTripIntent");
    },

    'Unhandled': function () {
        clearState.call(this);
        this.emit('NewSession');
    }
};

module.exports = newSessionHandlers;