
var handlers = {
    'LaunchRequest': function () {
        this.emit("NewTripIntent");
    },
    "NewTripIntent": function () {
        let prompt = this.t("ASK_NEW_TRIP");
        let reprompt = this.t("LAUNCH_REPROMPT")
        this.response.speak(this.t("WELCOME_MSG") + ' ' + prompt).listen(reprompt);
        this.emit(':responseReady');
    }
};

module.exports = handlers;