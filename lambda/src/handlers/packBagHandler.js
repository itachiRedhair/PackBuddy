
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
        this.attributes['JUST_PACKING_STARTED'] = true;
        this.emit(":responseReady");
    },

    'packBagIntent': function () {
        var reprompt = "You can say yes or no";

        if(this.attributes['JUST_PACKING_STARTED']) {
            this.attributes['JUST_PACKING_STARTED'] = false;
            this.attributes['PACKING_STATUS'] = constants.packingStatus.IN_PROGRESS;
            


            this.response.speak("Let's start with ").listen(reprompt);
        } else {

        }

        switch (getPackingStatus()) {
            case constants.packingStatus.STARTED:
                
                break;
            case constants.packingStatus.IN_PROGRESS:
                this.response.speak("Now pack ").listen(reprompt);
                break;
            case constants.packingStatus.COMPLETED:
                this.response.speak("You are done");
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
        if(this.attributes['JUST_PACKING_STARTED']) {
            // Start putting thiusngs in the bad
            this.emit('packBagIntent');
        } else {

        }
        // if (getPackingStatus() !== constants.packingStatus.COMPLETED) {
        //     this.emitWithState('packBagIntent');
        // } else {
        //     this.response.speak("You are done with the packing.");
        //     this.emit(":responseReady");
        // }
    },

    'AMAZON.NoIntent': function () {
        if(this.attributes['JUST_PACKING_STARTED']){
            // User said no when asked if he/she wanted to start packing right away
            this.response.speak('Okay, I am saving the information. You can resume later');
        } else {
            // User said no in any other case
        }

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

getPackingStatus = () => {

}

module.exports = packBagHandler;