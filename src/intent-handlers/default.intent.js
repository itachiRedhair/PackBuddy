const respondToLaunchRequest = require('../responses/launch-request.response');
const respondToUnhandledRequest = require('../responses/unhandled.response');

module.exports = {
    'LaunchRequest': function () {
        this.emit(':tell', respondToLaunchRequest());
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = 'This is the Hello World Sample Skill. ';
        const reprompt = 'Say hello, to hear me speak.';

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak('Goodbye!');
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak('See you later!');
        this.emit(':responseReady');
    },
    'Unhandled': function () {
        this.emit(':tell', respondToUnhandledRequest());
    },
};
