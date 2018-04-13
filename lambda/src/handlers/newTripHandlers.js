'use strict';
const Alexa = require("alexa-sdk");

//helper imports
const ddb = require("./../utilities/ddbController");
const tripSchema = require("./../assets/tripSchema");
const fetchWeather = require("./../utilities/weather");
const generatePackingList = require("./../utilities/packingListController").createPackingList;
const initializePackingSession = require("./../utilities/packingListController").setPackingSession;
const clearState = require("./../utilities/helper").clearState;


//constants imports
const states = require("./../constants").states;
const intents = require("./../constants").intents;


//handler functions
const newSessionHandler = function () {
    const message = "Tell me about your trip. Where are you going?";
    this.response.speak(message).listen("You can say I am going to Washington");
    this.emit(":responseReady");
}

const newTripHandler = function () {
    var filledSlots = delegateSlotCollection.call(this);

    var userId = this.event.session.user.userId;

    if (validateSlots.call(this)) {
        generateTrip.call(this).then(tripDetails => {
            ddb.insertTrip(userId, tripDetails)
                .then(() => {
                    // console.log('in genrate trip promise return packignschema', packingSchema);
                    initializePackingSession.call(this, tripDetails);
                    // console.log('data of dynamodb', data);
                    this.handler.state = states.PACKING;
                    this.emitWithState("NewSession");
                }).catch(error => {
                    console.log('error catched in dynamodb', error);
                });
        }).catch(err => {
            console.log('error catched in genearate trip', err)
        });
    }
}

const helpHandler = function () {
    const message = 'Try saying I am going to Los Angeles';
    this.response.speak(message)
        .listen(message);
    this.emit(':responseReady');
}

const yesHandler = function () {
    this.emitWithState('NewSession');
}

const noHandler = function () {
    clearState.call(this);
    this.response.speak('Ok, see you next time!');
    this.emit(':responseReady');
}

const stopHandler = function () {
    clearState.call(this);
    this.response.speak("Good Bye");
    this.emit(":responseReady");
}

const sessionEndHandler = function () {
    clearState.call(this);
    this.emit(':saveState', true)
}

const unhandlerHandler = function () {
    const message = 'Try saying I am going to Los Angeles';
    this.response.speak(message)
        .listen(message);
    this.emit(':responseReady');
}


//helper functions
const delegateSlotCollection = function () {
    // console.log("in delegateSlotCollection");
    // console.log("current dialogState: " + this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
        // console.log("in Beginning");
        var updatedIntent = this.event.request.intent;
        //optionally pre-fill slots: update the intent object with slot values for which
        //you have defaults, then return Dialog.Delegate with this updated intent
        // in the updatedIntent property
        this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
        // console.log("in not completed");
        // return a Dialog.Delegate directive with no updatedIntent property.
        this.emit(":delegate");
    } else {
        // console.log("in completed");
        // console.log("returning: " + JSON.stringify(this.event.request.intent));
        // Dialog is now complete and all required slots should be filled,
        // so call your normal intent handler.
        return this.event.request.intent;
    }
}

const generateTrip = function () {
    return new Promise((resolve, reject) => {
        let fromCity = this.event.request.intent.slots.fromCity.value;
        let toCity = this.event.request.intent.slots.toCity.value;
        let duration = this.event.request.intent.slots.duration.value;
        let date = this.event.request.intent.slots.date.value;
        let purpose = this.event.request.intent.slots.purpose.value;

        fromCity = fromCity.split(" ").join("");
        toCity = toCity.split(" ").join("");
        date = new Date(date).getTime() / 1000;
        let currentDate = new Date().getTime() / 1000;

        tripSchema.trip_info.from_city = fromCity;
        tripSchema.trip_info.to_city = toCity;
        tripSchema.trip_info.duration = duration;
        tripSchema.trip_info.date = date;
        tripSchema.trip_info.purpose = purpose;
        tripSchema.trip_info.trip_name = fromCity + "_" + toCity + "_" + date;
        tripSchema.trip_id = fromCity + "_" + toCity + "_" + date;
        // console.log('tripSchema', tripSchema);

        generatePackingList(toCity, date, duration)
            .then(list => {
                let count = 0;
                for (var listKey in list) {
                    const len = Object.keys(list[listKey]).length;
                    count += len;
                }
                tripSchema.packing_list = list;
                // tripSchema.total_item_count = count;
                // console.log(tripSchema.packing_list)
                resolve(tripSchema);
            }).catch(err => reject(err));

    });
}

const validateSlots = function () {
    let fromCity = this.event.request.intent.slots.fromCity.value;
    let toCity = this.event.request.intent.slots.toCity.value;
    let duration = this.event.request.intent.slots.duration.value;
    let date = this.event.request.intent.slots.date.value;
    let purpose = this.event.request.intent.slots.purpose.value;

    return fromCity != undefined &&
        toCity != undefined &&
        duration != undefined &&
        date != undefined &&
        purpose != undefined;
}


//handlers initialization
let newTripHandlers = {};

newTripHandlers[intents.NewSession] = newSessionHandler;
newTripHandlers[intents.NewTripIntent] = newTripHandler;
newTripHandlers[intents.AMAZON.YesIntent] = yesHandler;
newTripHandlers[intents.AMAZON.NoIntent] = noHandler;
newTripHandlers[intents.AMAZON.HelpIntent] = helpHandler;
newTripHandlers[intents.AMAZON.StopIntent] = stopHandler;
newTripHandlers[intents.SessionEndedRequest] = sessionEndHandler;
newTripHandlers[intents.Unhandled] = unhandlerHandler;

let newTripHandlersWithState = Alexa.CreateStateHandler(states.NEW_TRIP, newTripHandlers);

module.exports = newTripHandlersWithState;