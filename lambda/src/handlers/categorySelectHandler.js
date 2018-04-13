'use strict';

var Alexa = require("alexa-sdk");
var ddb = require('./../utilities/ddbController');

const getNotPackedCategories = require("./../utilities/packingListController").getNotPackedCategories;
const getRemindMeStatus = require("./../utilities/packingListController").getRemindMeStatus;
const resetRemindMePackingList = require("./../utilities/packingListController").resetRemindMePackingList;

var clearState = require("./../utilities/helper").clearState;

//constants
const states = require("./../constants").states;
const session = require("./../constants").session;
const packingStatus = require("./../constants").packingStatus;

const categorySelectHandlers = Alexa.CreateStateHandler(states.CATEGORY_SELECT, {

    'NewSession': function () {
        //do some handling and emit list category intent
        this.emitWithState("ListCategoryIntent");
    },

    'ListInvokeIntent': function () {
        this.attributes[session.CURRENT_TOTAL_PACKING_STATUS] = packingStatus.STARTED;
        this.emitWithState("ListCategoryIntent");
    },

    'ListCategoryIntent': function () {
        //get list from getPackingCategories() method in packinglistcontroller
        let categories = getNotPackedCategories.call(this);

        let message = '';
        console.log('in list category intent', categories)
        if (categories.length) {
            let packingList = this.attributes[session.CURRENT_PACKING_LIST];
            let totalPackingStatus = this.attributes[session.CURRENT_TOTAL_PACKING_STATUS];

            message = "What do you want to pack";
            let reprompt = "You can try give me list"

            if (totalPackingStatus === packingStatus.STARTED) {
                message += "? "
                categories.forEach(category => {
                    message += packingList[category].name + ", ";
                });
                message += "Select one."

                this.response.speak(message).listen(reprompt);
                this.emit(":responseReady");
            } else {
                this.response.speak(message + " now?").listen(reprompt);
                this.emit(":responseReady");
            }
        } else {
            if (getRemindMeStatus.call(this) === true) {
                console.log('get remind me status = true');
                let message = 'There are some items you asked me to remind me. Do you want to pack them now?'
                this.response.speak(message).listen(message);
                this.emit(":responseReady");
            } else {
                console.log('get remind me status = false');
                this.handler.state = states.PACKING;
                this.emitWithState("PackingCompleteIntent");
            }
        }
    },

    'AMAZON.YesIntent': function () {
        resetRemindMePackingList.call(this);
        this.attributes[session.CURRENT_TOTAL_PACKING_STATUS] = packingStatus.STARTED;
        this.emitWithState("ListCategoryIntent");
    },

    'AMAZON.NoIntent': function () {
        this.handler.state = states.PACKING;
        this.emitWithState("PackingCompleteIntent");
    },

    'SelectCategoryIntent': function () {
        //get value in slot and emit pack Bag intent with current category session attribute
        let selectedCategory = this.event.request.intent.slots.selectedCategory.resolutions.resolutionsPerAuthority[0].values[0].value.name;
        let packingList = this.attributes[session.CURRENT_PACKING_LIST];
        // this.response.speak("Let's start packing your " + packingList[selectedCategory].name);
        this.attributes[session.CURRENT_PACKING_CATEGORY_KEY] = selectedCategory;
        this.attributes[session.CURRENT_CATEGORY_PACKING_STATUS] = packingStatus.IN_PROGRESS;
        this.attributes[session.CURRENT_TOTAL_PACKING_STATUS] = packingStatus.IN_PROGRESS;
        this.handler.state = states.PACKING;
        this.emitWithState("PackNewCategoryIntent");
    },


    'AMAZON.HelpIntent': function () {
        const message = "Try saying let's pack clothes ";
        this.response.speak(message)
            .listen(message);
        this.emit(':responseReady');
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
            this.emit(':saveState', true)
        });
    },

    'Unhandled': function () {
        const message = "You can say give me list and then proceed with the category";
        this.response.speak(message)
            .listen(message);
        this.emit(':responseReady');
    }
});



module.exports = categorySelectHandlers;