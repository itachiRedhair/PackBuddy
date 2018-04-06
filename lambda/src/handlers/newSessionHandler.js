var Alexa = require("alexa-sdk");

//constants
const states = require("./../constants").states;

const newSessionHandlers = {
    'NewSession': function () {
        if (Object.keys(this.attributes).length === 0) {
            //if it's the first time the skill has been invoked
        }
        this.handler.state = states.NEW_TRIP;
        this.response.speak('Hi I am Pack Buddy. Do you want help with packing?')
            .listen('Do you need help with packing?');
        this.emit(':responseReady');
    }
};

module.exports = newSessionHandlers;