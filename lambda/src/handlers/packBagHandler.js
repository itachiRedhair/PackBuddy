'use strict';

var Alexa = require("alexa-sdk");
var ddb = require('./../utilities/ddbController')
var getRandomString = require("./../utilities/randomStrings").getRandomString;
var clearState = require("./../utilities/helper").clearState;

//constants
const states = require("./../constants").states;
const session = require("./../constants").session;
const packingStatus = require("./../constants").packingStatus;
const packingItemStatus = require("./../constants").packingItemStatus;

const packBagHandler = Alexa.CreateStateHandler(states.PACKING, {

    'NewSession': function () {
        const message = "Let's start packing. Shall we?";
        this.response.speak(message).listen("Do you want to start packing right now?");
        this.emit(":responseReady");
    },

    'PackItemIntent': function () {
        let reprompt = "You can say yes or no";

        getCategoryPackingStatus.call(this);

        let item = this.attributes[session.CURRENT_PACKING_ITEM];

        switch (this.attributes[session.CURRENT_CATEGORY_PACKING_STATUS]) {
            // case packingStatus.STARTED:
            //     this.response.speak("Let's start with " + item.name).listen(reprompt);
            //     break;
            case packingStatus.IN_PROGRESS:
                this.response.speak(getRandomString('packPrompt') + " " + item.name).listen(reprompt);
                break;
            case packingStatus.COMPLETED:
                // clearState.call(this);
                // this.response.speak("Your packing is completed. Have a nice journey. Feel free to call me again for packing. See Ya!");
                // console.log('here in switch case completed in packitemintent');
                let categoryKey = this.attributes[session.CURRENT_PACKING_CATEGORY_KEY]
                this.attributes[session.CURRENT_PACKING_LIST][categoryKey]['all_packed'] = true;
                this.handler.state = states.CATEGORY_SELECT;
                this.emitWithState('ListCategoryIntent');
                break;
            default:
                this.response.speak("There is some problem. Sorry for inconvenience.");
        }

        this.emit(":responseReady");
    },

    'PackNewCategoryIntent': function () {
        this.emitWithState("PackItemIntent");
    },

    'PackingCompleteIntent': function () {
        clearState.call(this);
        console.log('in packing complete intent before then');
        ddb.updatePackingList.call(this).then(() => {
            console.log('in packing complete intent inside then');
            this.attributes[session.CURRENT_TOTAL_PACKING_STATUS] = packingStatus.COMPLETED;
            this.response.speak("Your packing is complete. Thank you!");
            this.emit(":responseReady");
        }).catch(err => {
            console.log(err);
            this.response.speak("Your packing is complete. Thank you!");
            this.emit(":responseReady");
        })
    },

    'AMAZON.HelpIntent': function () {
        const message = 'Try saying let\'s start packing';
        this.response.speak(message)
            .listen(message);
        this.emit(':responseReady');
    },

    'AMAZON.YesIntent': function () {

        switch (this.attributes[session.CURRENT_TOTAL_PACKING_STATUS]) {
            case packingStatus.STARTED:
                this.handler.state = states.CATEGORY_SELECT;
                this.emitWithState('NewSession');
                break;
            case packingStatus.IN_PROGRESS:
                var currentPackingItemKey = this.attributes[session.CURRENT_PACKING_ITEM_KEY];
                var currentPackingCategoryKey = this.attributes[session.CURRENT_PACKING_CATEGORY_KEY];
                this.attributes[session.CURRENT_PACKING_LIST][currentPackingCategoryKey]['items'][currentPackingItemKey]['status'] = packingItemStatus.PACKED;
                this.emitWithState('PackItemIntent');
                break;
            default:
                let message = "Maybe try something else. like saying help me packing"
                this.response.speak(message).listen(message);
                this.emit(":responseReady");
        }
    },

    'AMAZON.NoIntent': function () {

        switch (this.attributes[session.CURRENT_TOTAL_PACKING_STATUS]) {
            case packingStatus.STARTED:
                clearState.call(this);
                ddb.updatePackingList.call(this)(() => {
                    this.response.speak('Ok, see you next time!');
                    this.emit(':responseReady');
                });
                break
            case packingStatus.IN_PROGRESS:
                var currentPackingItemKey = this.attributes[session.CURRENT_PACKING_ITEM_KEY];
                var currentPackingCategoryKey = this.attributes[session.CURRENT_PACKING_CATEGORY_KEY];
                this.attributes[session.CURRENT_PACKING_LIST][currentPackingCategoryKey]['items'][currentPackingItemKey]['status'] = packingItemStatus.NOT_INTERESTED;
                this.emitWithState('PackItemIntent');
                break;
            default:
                this.response.speak("Maybe try something else. like saying help me packing");
                this.emit(":responseReady");
        }
    },

    'RemindLaterIntent': function () {

        switch (this.attributes[session.CURRENT_TOTAL_PACKING_STATUS]) {
            case packingStatus.STARTED:
                this.emitWithState('Unhandled');
            case packingStatus.IN_PROGRESS:
                var currentPackingItemKey = this.attributes[session.CURRENT_PACKING_ITEM_KEY];
                var currentPackingCategoryKey = this.attributes[session.CURRENT_PACKING_CATEGORY_KEY];
                this.attributes[session.CURRENT_PACKING_LIST][currentPackingCategoryKey]['items'][currentPackingItemKey]['status'] = packingItemStatus.REMIND_LATER;
                this.attributes[session.CURRENT_PACKING_LIST][currentPackingCategoryKey]['remind_later'] = true;
                this.emitWithState('PackItemIntent');
                break;
            default:
                this.response.speak("Maybe try something else. like saying help me packing").listen("Maybe try something else. like saying help me packing");
                this.emit(":responseReady");
        }
    },

    'AMAZON.StopIntent': function () {
        clearState.call(this);
        ddb.updatePackingList.call(this).then(() => {
            this.response.speak("Good Bye");
            this.emit(":responseReady");
        });
    },

    'SessionEndedRequest': function () {
        clearState.call(this);
        ddb.updatePackingList.call(this).then(() => {
            this.emit(':saveState', true);
        });
    },

    'Unhandled': function () {
        const message = 'Try saying let start packing';
        this.response.speak(message)
            .listen(message);
        this.emit(':responseReady');
    }
});


function getCategoryPackingStatus() {

    let packingList = this.attributes[session.CURRENT_PACKING_LIST];
    let categoryKey = this.attributes[session.CURRENT_PACKING_CATEGORY_KEY]
    // for (var categoryKey in packingList) {
    let category = packingList[categoryKey]

    for (var itemKey in category.items) {
        let item = category.items[itemKey];

        if (item.status === packingItemStatus.NOT_PACKED) {
            // this.attributes[session.CURRENT_PACKING_CATEGORY_KEY] = categoryKey;
            this.attributes[session.CURRENT_PACKING_ITEM_KEY] = itemKey;
            this.attributes[session.CURRENT_PACKING_ITEM] = item;
            this.attributes[session.CURRENT_CATEGORY_PACKING_STATUS] = packingStatus.IN_PROGRESS;
            return;
        }
    }
    // }

    this.attributes[session.CURRENT_CATEGORY_PACKING_STATUS] = packingStatus.COMPLETED;
    return;
}

module.exports = packBagHandler;