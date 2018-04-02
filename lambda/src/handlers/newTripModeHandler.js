var Alexa = require("alexa-sdk");
const constants = require("./../constants")

const newTripModeHandler = Alexa.CreateStateHandler(constants.states.NEW_TRIP, {

    'NewSession': function () {
        this.handler.state = '' // delete this.handler.state might cause reference errors
        delete this.attributes['STATE']
        const message = "Tell me about your trip";
        this.response.speak(message);
        this.emit(":responseReady");
    },

    'AMAZON.HelpIntent': function () {
        const message = 'In help intent in new trip mode handler';
        this.response.speak(message)
            .listen(message);
        this.emit(':responseReady');
    },

    'AMAZON.YesIntent': function () {
        this.emitWithState('NewSession')
    },

    'AMAZON.NoIntent': function () {
        this.response.speak('Ok, see you next time!');
        this.emit(':responseReady');
    },

    'SessionEndedRequest': function () {
        this.handler.state = '' // delete this.handler.state might cause reference errors
        delete this.attributes['STATE'];
        this.emit(':saveState', true)
    },

    'Unhandled': function () {
        const message = 'Say yes to continue, or no to end';
        this.response.speak(message)
            .listen(message);
        this.emit(':responseReady');
    }
});

module.exports = newTripModeHandler;