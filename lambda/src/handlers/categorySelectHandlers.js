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
const messages = require("./../messages");


//handler functions
const newSessionHandler = function () {
    //do some handling and emit list category intent
    this.emitWithState(intents.ListCategoryIntent);
}

const listInvokeHandler = function () {
    this.attributes[session.CURRENT_TOTAL_PACKING_STATUS] = packingStatus.STARTED;
    this.emitWithState(intents.ListCategoryIntent);
}

const listCategoryHandler = function () {
    let categories = getNotPackedCategories.call(this);

    let message = '';
    console.log('in list category intent', categories)
    let packingList = this.attributes[session.CURRENT_PACKING_LIST];
    let totalPackingStatus = this.attributes[session.CURRENT_TOTAL_PACKING_STATUS];

    if (categories.length > 2) {
        message = messages.SELECT_CATEGORY_QUESTION;

        if (totalPackingStatus === packingStatus.STARTED) {
            message += "? ";
            message += "Select one from ";

            categories.forEach(category => {
                message += packingList[category].name + ", ";
            });

            this.response.speak(message).listen(messages.SELECT_CATEGORY_QUESTION_REPROMPT);
            this.emit(":responseReady");
        } else {
            this.response.speak(message + " now?").listen(messages.SELECT_CATEGORY_QUESTION_REPROMPT);
            this.emit(":responseReady");
        }

    } else if (categories.length === 1) {

        let selectedCategory = categories[0];
        let prompt = messages.REMAINING_SINGLE_CATEGORY_PROMPT + selectedCategory + ". ";
        this.attributes[session.PROMPT_QUEUE] = [prompt];
        this.attributes[session.CURRENT_PACKING_CATEGORY_KEY] = selectedCategory;
        this.emitWithState(intents.StartSelectedCategoryIntent);

    } else if (categories.length === 2) {
        message = messages.SELECT_CATEGORY_QUESTION;
        
        if (totalPackingStatus === packingStatus.STARTED) {
            message += "? Select one from " + packingList[categories[0]].name + " or " + packingList[categories[1]].name;

            this.response.speak(message).listen(messages.SELECT_CATEGORY_QUESTION_REPROMPT);
            this.emit(":responseReady");
        } else {
            this.response.speak(message + " now?").listen(messages.SELECT_CATEGORY_QUESTION_REPROMPT);
            this.emit(":responseReady");
        }

    } else {
        if (getRemindMeStatus.call(this) === true) {
            console.log('get remind me status = true');
            this.response.speak(messages.REMIND_ITEMS_PACK_QUESTION).listen(messages.REMIND_ITEMS_PACK_QUESTION);
            this.emit(":responseReady");
        } else {
            console.log('get remind me status = false');
            this.handler.state = states.PACKING;
            this.emitWithState(intents.PackingCompleteIntent);
        }
    }
}

const selectCategoryHandler = function () {
    let selectedCategory = this.event.request.intent.slots.selectedCategory.resolutions.resolutionsPerAuthority[0].values[0].value.name;
    this.attributes[session.CURRENT_PACKING_CATEGORY_KEY] = selectedCategory;
    this.emitWithState(intents.StartSelectedCategoryIntent)
}

const startSelectedCategoryHandler = function () {
    this.attributes[session.CURRENT_CATEGORY_PACKING_STATUS] = packingStatus.IN_PROGRESS;
    this.attributes[session.CURRENT_TOTAL_PACKING_STATUS] = packingStatus.IN_PROGRESS;
    this.handler.state = states.PACKING;
    this.emitWithState(intents.PackNewCategoryIntent);
}

const yesHandler = function () {
    resetRemindMePackingList.call(this);
    this.attributes[session.CURRENT_TOTAL_PACKING_STATUS] = packingStatus.STARTED;
    this.emitWithState(intents.ListCategoryIntent);
}

const noHandler = function () {
    this.handler.state = states.PACKING;
    this.emitWithState(intents.PackingCompleteIntent);
}

const helpHandler = function () {
    this.response.speak(messages.SELECT_CATEGORY_HELP)
        .listen(messages.SELECT_CATEGORY_HELP);
    this.emit(':responseReady');
}

const stopHandler = function () {
    clearState.call(this);
    ddb.updatePackingList.call(this).then(() => {
        this.response.speak(messages.SELECT_CATEGORY_STOP);
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
    this.response.speak(messages.SELECT_CATEGORY_UNHANDLED)
        .listen(messages.SELECT_CATEGORY_UNHANDLED);
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
categorySelectHandlers[intents.StartSelectedCategoryIntent] = startSelectedCategoryHandler;

let categorySelectHandlersWithState = Alexa.CreateStateHandler(states.CATEGORY_SELECT, categorySelectHandlers);

module.exports = categorySelectHandlersWithState;