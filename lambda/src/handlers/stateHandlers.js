'use strict';

const Alexa = require('alexa-sdk');
var constants = require('./../constants')

const stateHandlers = {
    startModeIntentHandlers: Alexa.CreateStateHandler(constants.states.LAUNCH, {
        /*
         *  All Intent Handlers for state : START_MODE
         */
        'LaunchRequest': function () {
            var message = "Hi I am packbuddy. Do you want to start packing?";
            var reprompt = 'Do you need help with packing?';
            // this.handler.state = states.LAUNCH;
            this.handler.state = constants.states.LAUNCH;
            this.response.speak(message).listen(reprompt);
            this.emit(':responseReady');
        },
        'AMAZON.YesIntent': function () {
            console.log('states', constants.states.NEW_TRIP);
            // this.handler.state = states.NEW_TRIP;
            this.handler.state = constants.states.NEW_TRIP
            this.emitWithState("NewTripIntent");
        },
        'AMAZON.NoIntent': function () {
            var message = "Welcome to the Birthday Hotline. You can say, play the audio, to begin";
            this.response.speak(message)
            this.emit(':responseReady');
        },
        'AMAZON.HelpIntent': function () {
            var message = "Welcome to the Birthday Hotline. You can say, play the audio, to begin";
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        },
        'AMAZON.StopIntent': function () {
            var message = 'Good bye.';
            this.response.speak(message);
            this.emit(':responseReady');
        },
        'AMAZON.CancelIntent': function () {
            var message = 'Good bye.';
            this.response.speak(message);
            this.emit(':responseReady');
        },
        'SessionEndedRequest': function () {
            this.handler.state = '' // delete this.handler.state might cause reference errors
            delete this.attributes['STATE'];
            this.emit(':saveState', true);
        },
        'Unhandled': function () {
            var message = 'Sorry, I could not understand. Please say, play the audio, to begin the audio.';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        }
    }),
    newTripModeIntentHandlers: Alexa.CreateStateHandler(constants.states.NEW_TRIP, {
        /*
         *  All Intent Handlers for state : PLAY_MODE
         */
        'LaunchRequest': function () {
            var message = "in launcg request of new trip model intent handler";
            var reprompt = "reprompt of launch requet of new trip model intent handler"
            this.response.speak(message).listen(reprompt);
            this.emit(':responseReady');
        },
        'NewTripIntent': function () {
            var message = "Tell me about your trip";
            this.response.speak(message);
            this.emit(':responseReady');
        },
        'AMAZON.HelpIntent': function () {
            // This will called while audio is playing and a user says "ask <invocation_name> for help"
            var message = "You are listening to the Birthday Hotline. You can say, Next or Previous to navigate through the playlist. " +
                'At any time, you can say Pause to pause the audio and Resume to resume.';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        },
        'SessionEndedRequest': function () {
            this.handler.state = '' // delete this.handler.state might cause reference errors
            delete this.attributes['STATE'];
            this.emit(':saveState', true);
        },
        'Unhandled': function () {
            var message = 'Sorry, I could not understand. You can say, Next or Previous to navigate through the playlist.';
            this.response.speak(message).listen(message);
            this.emit(':responseReady');
        }
    })
};

module.exports = stateHandlers;