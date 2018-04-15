'use strict';

const Alexa = require("alexa-sdk");

//helper function imports
const ddb = require('./../utilities/ddbController')
const getRandomString = require("./../utilities/randomStrings").getRandomString;
const clearState = require("./../utilities/helper").clearState;

//constants imports
const states = require("./../constants").states;
const session = require("./../constants").session;
const packingStatus = require("./../constants").packingStatus;
const packingItemStatus = require("./../constants").packingItemStatus;
const intents = require("./../constants").intents;
const messages = require("./../messages");


//handler function
const newSessionHandler = function () {
    this.response.speak(messages.PACK_BAG_START_QUESTION).listen(messages.PACK_BAG_START_QUESTION_REPROMPT);
    this.emit(":responseReady");
}

const packItemHandler = function () {
    // let silentAudio = "<audio src='https://s3.amazonaws.com/silent80secondsaudio/silence_80_sec.mp3'/>"
    getCategoryPackingStatus.call(this);

    let item = this.attributes[session.CURRENT_PACKING_ITEM];

    switch (this.attributes[session.CURRENT_CATEGORY_PACKING_STATUS]) {
        // case packingStatus.STARTED:
        //     this.response.speak("Let's start with " + item.name).listen(reprompt);
        //     break;
        case packingStatus.IN_PROGRESS:

            let prompt = getRandomString(messages.PACK_ITEM_PROMPT) + " " + item.name;
            this.attributes[session.PROMPT_QUEUE].push(prompt);
            prompt = this.attributes[session.PROMPT_QUEUE];
            prompt = prompt.join(" ");
            // prompt += silentAudio;
            this.response.speak(prompt).listen(messages.PACK_ITEM_REPROMPT);
            this.attributes[session.PROMPT_QUEUE] = [];
            break;

        case packingStatus.COMPLETED:

            // console.log('here in switch case completed in packitemintent');
            let categoryKey = this.attributes[session.CURRENT_PACKING_CATEGORY_KEY]
            this.attributes[session.CURRENT_PACKING_LIST][categoryKey]['all_packed'] = true;
            this.handler.state = states.CATEGORY_SELECT;
            this.emitWithState(intents.ListCategoryIntent);
            break;

        default:
            this.response.speak("There is some problem. Sorry for inconvenience.");
    }

    this.emit(":responseReady");
}

const packNewCategoryHandler = function () {
    this.emitWithState(intents.PackItemIntent);
}

const packingCompleteHandler = function () {
    clearState.call(this);
    console.log('in packing complete intent before then');
    ddb.updatePackingList.call(this).then(() => {
        console.log('in packing complete intent inside then');
        this.attributes[session.CURRENT_TOTAL_PACKING_STATUS] = packingStatus.COMPLETED;
        this.response.speak(messages.PACK_COMPLETE_PROPMT);
        this.emit(":responseReady");
    });
}

const helpHandler = function () {
    this.response.speak(messages.PACK_HELP)
        .listen(messages.PACK_HELP);
    this.emit(':responseReady');
}

const yesHandler = function () {

    switch (this.attributes[session.CURRENT_TOTAL_PACKING_STATUS]) {
        case packingStatus.STARTED:
            this.handler.state = states.CATEGORY_SELECT;
            this.emitWithState(intents.NewSession);
            break;
        case packingStatus.IN_PROGRESS:
            var currentPackingItemKey = this.attributes[session.CURRENT_PACKING_ITEM_KEY];
            var currentPackingCategoryKey = this.attributes[session.CURRENT_PACKING_CATEGORY_KEY];
            this.attributes[session.CURRENT_PACKING_LIST][currentPackingCategoryKey]['items'][currentPackingItemKey]['status'] = packingItemStatus.PACKED;
            this.emitWithState(intents.PackItemIntent);
            break;
        default:
            let message = "Maybe try something else. like saying help me packing"
            this.response.speak(message).listen(message);
            this.emit(":responseReady");
    }
}

const noHandler = function () {
    console.log('in no handler function of pack bag intent');
    switch (this.attributes[session.CURRENT_TOTAL_PACKING_STATUS]) {
        case packingStatus.STARTED:
            clearState.call(this);
            ddb.updatePackingList.call(this).then(() => {
                this.response.speak(messages.PACK_BAG_START_NO);
                this.emit(':responseReady');
            });
            break
        case packingStatus.IN_PROGRESS:
            console.log('in in progress condition of no handler function of pack bag intent');
            var currentPackingItemKey = this.attributes[session.CURRENT_PACKING_ITEM_KEY];
            var currentPackingCategoryKey = this.attributes[session.CURRENT_PACKING_CATEGORY_KEY];
            this.attributes[session.CURRENT_PACKING_LIST][currentPackingCategoryKey]['items'][currentPackingItemKey]['status'] = packingItemStatus.NOT_INTERESTED;
            this.emitWithState(intents.PackItemIntent);
            break;
        default:
            this.response.speak("Maybe try something else. like saying help me packing");
            this.emit(":responseReady");
    }
}

const remindMeLaterHandler = function () {

    switch (this.attributes[session.CURRENT_TOTAL_PACKING_STATUS]) {
        case packingStatus.STARTED:
            this.emitWithState(intents.Unhandled);
        case packingStatus.IN_PROGRESS:
            var currentPackingItemKey = this.attributes[session.CURRENT_PACKING_ITEM_KEY];
            var currentPackingCategoryKey = this.attributes[session.CURRENT_PACKING_CATEGORY_KEY];
            this.attributes[session.CURRENT_PACKING_LIST][currentPackingCategoryKey]['items'][currentPackingItemKey]['status'] = packingItemStatus.REMIND_LATER;
            this.attributes[session.CURRENT_PACKING_LIST][currentPackingCategoryKey]['remind_later'] = true;
            this.emitWithState(intents.PackItemIntent);
            break;
        default:
            this.emitWithState(intents.Unhandled);
    }
}

const waitHandler = function () {
    this.emitWithState(intents.AMAZON.StopIntent);
}

const stopHandler = function () {
    clearState.call(this);
    ddb.updatePackingList.call(this).then(() => {
        this.response.speak(messages.PACK_BAG_STOP);
        this.emit(":responseReady");
    });
}

const sessionEndHandler = function () {
    clearState.call(this);
    ddb.updatePackingList.call(this).then(() => {
        this.emit(':saveState', true);
    });
}

const unhandledHandler = function () {
    this.response.speak(messages.PACK_BAG_UNHANDLED)
        .listen(messages.PACK_BAG_UNHANDLED);
    this.emit(':responseReady');
}


//helper functions
const getCategoryPackingStatus = function () {

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


//handlers initialization
let packBagHandlers = {};

packBagHandlers[intents.NewSession] = newSessionHandler;
packBagHandlers[intents.PackItemIntent] = packItemHandler;
packBagHandlers[intents.PackNewCategoryIntent] = packNewCategoryHandler;
packBagHandlers[intents.PackingCompleteIntent] = packingCompleteHandler;
packBagHandlers[intents.AMAZON.HelpIntent] = helpHandler;
packBagHandlers[intents.AMAZON.YesIntent] = yesHandler;
packBagHandlers[intents.AMAZON.NoIntent] = noHandler;
packBagHandlers[intents.RemindLaterIntent] = remindMeLaterHandler;
packBagHandlers[intents.WaitIntent] = waitHandler;
packBagHandlers[intents.AMAZON.StopIntent] = stopHandler;
packBagHandlers[intents.SessionEndedRequest] = sessionEndHandler;
packBagHandlers[intents.Unhandled] = unhandledHandler;

let packBagHandlersWithState = Alexa.CreateStateHandler(states.PACKING, packBagHandlers);

module.exports = packBagHandlersWithState;