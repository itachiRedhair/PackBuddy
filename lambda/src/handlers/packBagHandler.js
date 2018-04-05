
var Alexa = require("alexa-sdk");
const constants = require("./../constants");
var ddb = require('./../utilities/ddbController')

var packingList = [
    'books',
    'clothes',
    'toothbrush'
]

var packingStatus = '';

const packBagHandler = Alexa.CreateStateHandler(constants.states.PACKING, {

    'NewSession': function () {
        const message = "Let's start packing. Shall we?";
        this.response.speak(message).listen("Do you want to start packing right now?");
        this.emit(":responseReady");
    },

    'packBagIntent': function () {
        var reprompt = "You can say yes or no";

        console.log('currentpackignItem->', this.attributes['currentPackingItem']);

        switch (getPackingStatus(this.attributes)) {
            case constants.packingStatus.STARTED:
                this.attributes['currentPackingItem'] = packingList[0];
                this.response.speak("Let's start with " + this.attributes['currentPackingItem']).listen(reprompt);
                break;
            case constants.packingStatus.IN_PROGRESS:
                this.attributes['currentPackingItem'] = packingList[++packingList.indexOf(this.attributes['currentPackingItem'])];
                this.response.speak("Now pack " + this.attributes['currentPackingItem']).listen(reprompt);
                break;
            case constants.packingStatus.COMPLETED:
                this.response.speak("You are done");
                delete this.attributes['currentPackingItem'];
                break;
            default:
                this.response.speak("There is some problem. Sorry for inconvenience.");
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
        this.emitWithState('packBagIntent');
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

getPackingStatus = (attributes) => {
    currentPackingItem = attributes['currentPackingItem'];
    if (currentPackingItem === undefined) {
        return constants.packingStatus.STARTED;
    } else if (packingList.indexOf(currentPackingItem) < packingList.length) {
        return constants.packingStatus.IN_PROGRESS
    } else if (packingList.indexOf(currentPackingItem) === packingList.length) {
        return constants.packingStatus.COMPLETED;
    }
}

module.exports = packBagHandler;