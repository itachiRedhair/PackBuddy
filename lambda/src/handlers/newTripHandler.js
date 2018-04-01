var Alexa = require("alexa-sdk");
var states = require("../states/states");

var handler = Alexa.CreateStateHandler(states.NEW_TRIP, {
    'NewSession': function () {
        let propmpt = this.t("ASK_ABOUT_TRIP");
        let reprompt = this.t("REPROMPT");
        this.response.speak(prompt).listen(reprompt);
        this.emit(":responseReady");
    }
})

module.exports = handler;