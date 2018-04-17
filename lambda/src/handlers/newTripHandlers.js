'use strict';
const Alexa = require("alexa-sdk");

//helper imports
const ddb = require("./../utilities/ddbController");
const tripSchema = require("./../assets/tripSchema");
const fetchWeather = require("./../utilities/weather");
const generatePackingList = require("./../utilities/packingListController").createPackingList;
const initializePackingSession = require("./../utilities/packingListController").setPackingSession;
const clearState = require("./../utilities/helper").clearState;

const AlexaDeviceAddressClient = require('./../utilities/deviceAddress');


//constants imports
const states = require("./../constants").states;
const intents = require("./../constants").intents;
const messages = require("./../messages");

//handler functions
const newSessionHandler = function () {
    this.response.speak(messages.NEW_TRIP_START_QUESTION).listen(messages.NEW_TRIP_START_QUESTION_REPROMPT);
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
                    this.emitWithState(intents.NewSession);
                }).catch(error => {
                    // console.log('error catched in dynamodb', error);
                });
        }).catch(err => {
            // console.log('error catched in genearate trip', err)
        });
    }
}

const helpHandler = function () {
    this.response.speak(messages.NEW_TRIP_HELP)
        .listen(messages.NEW_TRIP_HELP);
    this.emit(':responseReady');
}

const yesHandler = function () {
    this.emitWithState(intents.NewSession);
}

const noHandler = function () {
    clearState.call(this);
    this.response.speak(messages.NEW_TRIP_NO);
    this.emit(':responseReady');
}

const stopHandler = function () {
    clearState.call(this);
    this.response.speak(messages.NEW_TRIP_STOP);
    this.emit(":responseReady");
}

const sessionEndHandler = function () {
    clearState.call(this);
    this.emit(':saveState', true)
}

const unhandlerHandler = function () {
    this.response.speak(messages.NEW_TRIP_UNHANDLED)
        .listen(messages.NEW_TRIP_UNHANDLED);
    this.emit(':responseReady');
}


//helper functions
const delegateSlotCollection = function () {
    // console.log("in delegateSlotCollection");
    // console.log("current dialogState: " + this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
        // console.log("in Beginning");
        let updatedIntent = this.event.request.intent;

        const consentToken = this.event.context.System.user.permissions.consentToken;
        const fromCity = this.event.request.intent.slots.fromCity.value;

        // console.log(consentToken);
        if (consentToken) {
            // console.log('inside consent token found condition')
            getDeviceAddress.call(this).then((fromCityValue) => {
                // console.log('before askForCity call in not started dialogstate condition');
                if (fromCityValue !== null) {
                    // console.log('fromCityValue', fromCityValue);
                    updatedIntent.slots.fromCity.value = fromCityValue;
                } else {
                    this.emit(":delegate", updatedIntent);
                }
                // askForCityIfCountryFound.call(this);
                let prompt = "Are you going from " + fromCityValue + "?";
                this.emit(':confirmSlot', "fromCity", prompt, prompt, updatedIntent);
                // this.emit(":delegate", updatedIntent);
            }).catch(err => {
                // console.log('error inside delegate function get device address call', err);
            });
        } else {
            // askForCityIfCountryFound.call(this);
            this.emit(":delegate", updatedIntent);
        }

    } else if (this.event.request.dialogState !== "COMPLETED") {
        // console.log('before askForCity call in not completed dialogstate condition');

        // askForCityIfCountryFound.call(this);

        this.emit(":delegate");
    } else {
        return this.event.request.intent;
    }
}


const getDeviceAddress = function () {
    return new Promise((resolve, reject) => {
        const deviceId = this.event.context.System.device.deviceId;
        const apiEndpoint = this.event.context.System.apiEndpoint;
        const consentToken = this.event.context.System.user.permissions.consentToken;

        const alexaDeviceAddressClient = new AlexaDeviceAddressClient(apiEndpoint, deviceId, consentToken);

        let deviceAddressRequest = alexaDeviceAddressClient.getCityFromDeviceAddress();

        deviceAddressRequest.then((addressResponse) => {
            // console.log("inside then of deviceaddrssRequest,", addressResponse);
            resolve(addressResponse);
            // console.info("Ending getAddressHandler()");
        }).catch(err => {
            // console.log('error whiel getting ocuntry and postal code', err);
            reject(err);
        });
    })
}

const askForCityIfCountryFound = function () {
    let toCountry = this.event.request.intent.slots.toCountry.value;
    let fromCountry = this.event.request.intent.slots.fromCountry.value;
    let toCity = this.event.request.intent.slots.toCity.value;
    let fromCity = this.event.request.intent.slots.fromCity.value;

    let updatedIntent = this.event.request.intent;

    if (!toCity && toCountry) {
        let message = "Tell which city you are going to in " + toCountry;
        // console.log('before this.emit of toCity elicitslot');
        this.emit(':elicitSlot', "toCity", message, message, updatedIntent);
    }

    if (fromCountry && !fromCity) {
        let message = "Tell which city you are going from in " + fromCountry;
        // console.log('before this.emit of fromCity elicitslot');
        this.emit(':elicitSlot', "fromCity", message, message, updatedIntent);
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

        generatePackingList.call(this, toCity, date, duration)
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