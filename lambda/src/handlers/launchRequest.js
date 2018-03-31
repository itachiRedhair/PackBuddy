
var handlers = {
    'LaunchRequest': function () {
        this.response.speak(this.t("WELCOME_MSG"));
        this.emit(':responseReady');
        this.emit('NewTripIntent');
    },
    "NewTripIntent": function () {
        this.response.speak(this.t("ASK_NEW_TRIP"));
        this.emit(':responseReady');
    }
};

module.exports = handlers;