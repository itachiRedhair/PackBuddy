
var Alexa = require("alexa-sdk");
const constants = require("./../constants");
var ddb = require('./../utilities/ddbController')

var packingList = [
    'books',
    'clothes',
    'toothbrush'
]


const packBagHandler = Alexa.CreateStateHandler(constants.states.PACKING, {

    'NewSession': function () {
        const message = "Let's start packing. Shall we?";
        this.response.speak(message).listen("Do you want to start packing right now?");
        this.emit(":responseReady");
    },

    'packBagIntent': function () {
        var reprompt = "You can say yes or no";
        console.log('currentpackignItem->', this.attributes['currentPackingItem']);
        if (this.attributes['currentPackingItem']) {
            var currentPackingItem = this.attributes['currentPackingItem']
            var currentPackingItemIndex = packingList.indexOf(currentPackingItem);
        }
        //say the results
        if (!this.attributes["currentPackingItem"]) {
            this.attributes['currentPackingItem'] = packingList[0];
            this.response.speak("Let's start with " + this.attributes['currentPackingItem']).listen(reprompt);
        } else if (currentPackingItemIndex <= packingList.length) {
            this.attributes['currentPackingItem'] = packingList[++currentPackingItemIndex];
            this.response.speak("Now pack " + this.attributes['currentPackingItem']).listen(reprompt);
        } else {
            this.response.speak("You are done");
            delete this.attributes['currentPackingItem'];
        }

        this.emit(":responseReady");
    },

    'AMAZON.HelpIntent': function () {
        const message = 'Try saying let\'s start packing';
        this.response.speak(message)
            .listen(message);
        this.emit(':responseReady');
    },

    'AMAZON.YesIntent': function () {
        if (this.attributes['currentPackingItem']) {

            this.emitWithState('packBagIntent');
        } else {
            this.emitWithState('packBagIntent');
        }
    },

    'AMAZON.NoIntent': function () {
        clearState.call(this);
        this.response.speak('Ok, see you next time!');
        this.emit(':responseReady');
    },

    'AMAZON.StopIntent': function () {
        clearState.call(this);
        this.response.speak("Good Bye");
        this.emit(":responseReady");
    },

    'SessionEndedRequest': function () {
        clearState.call(this);
        this.emit(':saveState', true)
    },

    'Unhandled': function () {
        const message = 'Try saying let start packing buddy';
        this.response.speak(message)
            .listen(message);
        this.emit(':responseReady');
    }
});

function clearState() {
    this.handler.state = '' // delete this.handler.state might cause reference errors
    delete this.attributes['STATE'];
}


module.exports = packBagHandler;