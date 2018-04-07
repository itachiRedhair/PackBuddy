'use strict';
var Alexa = require("alexa-sdk");
const constants = require("./../constants")

const newSessionHandlers = {
    'NewSession': function () {
        if (Object.keys(this.attributes).length === 0) {
            //if it's the first time the skill has been invoked
        }
        this.handler.state = constants.states.NEW_TRIP;
        this.response.speak('Hi I am Pack Buddy. Do you want help with packing?')
            .listen('Do you need help with packing?');
        this.emit(':responseReady');
    }
};

module.exports = newSessionHandlers;