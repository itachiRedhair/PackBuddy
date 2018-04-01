var Alexa = require("alexa-sdk");
var states = require("../states/states");

var handler = {
    'LaunchRequest': function () {
        let propmpt = this.t("WELCOME_MSG") + "  " + this.t("ASK_NEW_TRIP");
        let reprompt = this.t("ASK_NEW_TRIP");
        this.response.speak(prompt).listen(reprompt);
        this.emit(":responseReady");
    },
    'Amazon.YesIntent': function () {
        this.handler.state = states.NEW_TRIP;
        this.emitWithState("NewSession");
    },
    'Amazon.NoIntent': function () {
        this.response.speak("You said no to ask new trip");
        this.emit(":responseReady");
    }
}

module.exports = handler;