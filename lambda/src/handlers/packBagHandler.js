'use strict';
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
        let reprompt = "You can say yes or no";

        // if (this.attributes['JUST_PACKING_STARTED']) {
        //     this.attributes['JUST_PACKING_STARTED'] = false;
        //     this.attributes['PACKING_STATUS'] = constants.packingStatus.IN_PROGRESS;
        //     this.attributes['current_packing_list'] = ddb.getLastTripID


        // } else {

        // }
        getPackingStatus.call(this);

        let item = this.attributes['current_packing_item'];

        switch (this.attributes['current_packing_status']) {
            case constants.packingStatus.STARTED:
                this.response.speak("Let's start with " + item.name).listen(reprompt);
                break;
            case constants.packingStatus.IN_PROGRESS:
                this.response.speak("Now pack " + item.name).listen(reprompt);
                break;
            case constants.packingStatus.COMPLETED:
                clearState.call(this);
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
        //anand's code
        // if (this.attributes['JUST_PACKING_STARTED']) {
        //     // Start putting thiusngs in the bad
        //     this.emit('packBagIntent');
        // } else {

        // }

        //dont know who's code
        // if (getPackingStatus() !== constants.packingStatus.COMPLETED) {
        //     this.emitWithState('packBagIntent');
        // } else {
        //     this.response.speak("You are done with the packing.");
        //     this.emit(":responseReady");
        // }

        // if (this.attributes['current_packing_status'] === constants.packingStatus.NOT_STARTED) {
        //     this.attributes['current_packing_status'] === constants.packingStatus.STARTED;
        //     this.emitWithState('packBagIntent');
        // } else if (this.attributes['current_packing_status'] === constants.packingStatus.IN_PROGRESS) {
        //     this.emitWithState('packBagIntent');
        // }

        switch (this.attributes['current_packing_status']) {
            case constants.packingStatus.NOT_STARTED:
                this.attributes['current_packing_status'] === constants.packingStatus.STARTED;
                this.emitWithState('packBagIntent');
                break;
            case constants.packingStatus.IN_PROGRESS:
                var currentPackingItemKey = this.attributes['current_packing_item_key'];
                var currentPackingCategoryKey = this.attributes['current_packing_category_key'];
                this.attributes['current_packing_list'][currentPackingCategoryKey][currentPackingItemKey]['status'] = "PACKED";
                this.emitWithState('packBagIntent');
                break;
            default:
                this.response.speak("Maybe try something else. like saying help me packing");
                this.emit(":responseReady");
        }

    },

    'AMAZON.NoIntent': function () {
        // if (this.attributes['JUST_PACKING_STARTED']) {
        //     // User said no when asked if he/she wanted to start packing right away
        //     this.response.speak('Okay, I am saving the information. You can resume later');
        // } else {
        //     // User said no in any other case
        // }

        switch (this.attributes['current_packing_status']) {
            case constants.packingStatus.NOT_STARTED:
                clearState.call(this);
                this.response.speak('Ok, see you next time!');
                this.emit(':responseReady');
                break;
            case constants.packingStatus.IN_PROGRESS:
                var currentPackingItemKey = this.attributes['current_packing_item_key'];
                var currentPackingCategoryKey = this.attributes['current_packing_category_key'];
                this.attributes['current_packing_list'][currentPackingCategoryKey][currentPackingItemKey]['status'] = "NOT_INTERESTED";
                this.emitWithState('packBagIntent');
                break;
            default:
                this.response.speak("Maybe try something else. like saying help me packing");
                this.emit(":responseReady");
        }
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

function getPackingStatus() {

    var packingList = this.attributes['current_packing_list'];
    console.log('in getPackingStatus current_packing_list', this.attributes['current_packing_list']);
    for (var categoryKey in packingList) {
        category = packingList[categoryKey]

        for (var itemKey in category) {
            item = category[itemKey];

            if (category[itemKey].status === 'NOT_PACKED') {
                this.attributes['current_packing_category_key'] = categoryKey;
                this.attributes['current_packing_item_key'] = itemKey;
                this.attributes['current_packing_item'] = item;
                console.log('in getPackingStatus current_packing_item--->', this.attributes['current_packing_item']);
                this.attributes['current_packing_status'] = constants.packingStatus.IN_PROGRESS;
                // return this.attributes['current_packing_status'];
                return;
            }

        }
    }

    this.attributes['current_packing_status'] = constants.packingStatus.COMPLETED;
    // return this.attributes['current_packing_status'];
    return;
}

module.exports = packBagHandler;