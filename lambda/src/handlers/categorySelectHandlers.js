'use strict';

const Alexa = require("alexa-sdk");

//helper function imports
const ddb = require('./../utilities/ddbController');
const getNotPackedCategories = require("./../utilities/packingListController").getNotPackedCategories;
const getRemindMeStatus = require("./../utilities/packingListController").getRemindMeStatus;
const resetRemindMePackingList = require("./../utilities/packingListController").resetRemindMePackingList;
const clearState = require("./../utilities/helper").clearState;

//constants imports
const states = require("./../constants").states;
const session = require("./../constants").session;
const packingStatus = require("./../constants").packingStatus;
const intents = require("./../constants").intents;


//handler functions
const newSessionHandler = function () {
    //do some handling and emit list category intent
    this.emitWithState("ListCategoryIntent");
}

const listInvokeHandler = function () {
    this.attributes[session.CURRENT_TOTAL_PACKING_STATUS] = packingStatus.STARTED;
    this.emitWithState("ListCategoryIntent");
}

const listCategoryHandler = function () {
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
}

const selectCategoryHandler = function () {
    //get value in slot and emit pack Bag intent with current category session attribute
    let selectedCategory = this.event.request.intent.slots.selectedCategory.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    let packingList = this.attributes[session.CURRENT_PACKING_LIST];
    // this.response.speak("Let's start packing your " + packingList[selectedCategory].name);
    this.attributes[session.CURRENT_PACKING_CATEGORY_KEY] = selectedCategory;
    this.attributes[session.CURRENT_CATEGORY_PACKING_STATUS] = packingStatus.IN_PROGRESS;
    this.attributes[session.CURRENT_TOTAL_PACKING_STATUS] = packingStatus.IN_PROGRESS;
    this.handler.state = states.PACKING;
    this.emitWithState("PackNewCategoryIntent");
}

const yesHandler = function () {
    resetRemindMePackingList.call(this);
    this.attributes[session.CURRENT_TOTAL_PACKING_STATUS] = packingStatus.STARTED;
    this.emitWithState("ListCategoryIntent");
}

const noHandler = function () {
    this.handler.state = states.PACKING;
    this.emitWithState("PackingCompleteIntent");
}

const helpHandler = function () {
    const message = "Try saying let's pack clothes ";
    this.response.speak(message)
        .listen(message);
    this.emit(':responseReady');
}

const stopHandler = function () {
    clearState.call(this);
    ddb.updatePackingList.call(this).then(() => {
        this.response.speak("Good Bye");
        this.emit(":responseReady");
    });
}

const sessionEndHandler = function () {
    clearState.call(this);
    ddb.updatePackingList.call(this).then(() => {
        this.emit(':saveState', true)
    });
}

const unhandledHandler = function () {
    const message = "You can say give me list and then proceed with the category";
    this.response.speak(message)
        .listen(message);
    this.emit(':responseReady');
}


//handlers initialization
let categorySelectHandlers = {};

categorySelectHandlers[intents.NewSession] = newSessionHandler;
categorySelectHandlers[intents.ListInvokeIntent] = listInvokeHandler;
categorySelectHandlers[intents.ListCategoryIntent] = listCategoryHandler;
categorySelectHandlers[intents.SelectCategoryIntent] = selectCategoryHandler;
categorySelectHandlers[intents.AMAZON.YesIntent] = yesHandler;
categorySelectHandlers[intents.AMAZON.NoIntent] = noHandler;
categorySelectHandlers[intents.AMAZON.HelpIntent] = helpHandler;
categorySelectHandlers[intents.AMAZON.StopIntent] = stopHandler;
categorySelectHandlers[intents.SessionEndedRequest] = sessionEndHandler;

let categorySelectHandlersWithState = Alexa.CreateStateHandler(states.CATEGORY_SELECT, categorySelectHandlers);
module.exports = categorySelectHandlersWithState;