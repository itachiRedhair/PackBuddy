var Alexa = require("alexa-sdk");
var ddb = require("./../utilities/ddbController");
var tripSchema = require("./../assets/entrySchema");
var fetchWeather = require("./../utilities/weather");
var generatePackingList = require("./../utilities/packingListController").createPackingList;
var initializePackingSession = require("./../utilities/packingListController").setPackingSession;

//constants
const states = require("./../constants").states;

const newTripModeHandler = Alexa.CreateStateHandler(states.NEW_TRIP, {

    'NewSession': function () {
        const message = "Tell me about your trip. Where are you going?";
        this.response.speak(message).listen("You can say I am going to Washington");
        this.emit(":responseReady");
    },

    'NewTripIntent': function () {
        var filledSlots = delegateSlotCollection.call(this);
        // speechOutput= " from " + fromCity + " to " + toCity + " on " + date + " for " + duration + " days " + " for " + purpose;

        //say the results
        // this.response.speak(speechOutput);
        // this.emit(":responseReady");

        this.handler.state = states.PACKING;

        var userId = this.event.session.user.userId;

        if (validateSlots.call(this)) {
            generateTrip.call(this).then(packingSchema => {
                ddb.insertTrip(userId, packingSchema)
                    .then(data => {
                        console.log('in genrate trip promise return packignschema', packingSchema);

                        initializePackingSession.call(this, packingSchema.trip_id, packingSchema.packing_list);

                        console.log('data of dynamodb', data);
                        this.emitWithState("NewSession");
                    }).catch(error => {
                        console.log('error of dynamodb', error);
                    });
            });
        }
    },

    'AMAZON.HelpIntent': function () {
        const message = 'Try saying I am going to Los Angeles';
        this.response.speak(message)
            .listen(message);
        this.emit(':responseReady');
    },

    'AMAZON.YesIntent': function () {
        this.emitWithState('NewSession')
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
        const message = 'Try saying I am going to Los Angeles';
        this.response.speak(message)
            .listen(message);
        this.emit(':responseReady');
    }
});

function delegateSlotCollection() {
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

function clearState() {
    this.handler.state = '' // delete this.handler.state might cause reference errors
    delete this.attributes['STATE'];
}

function generateTrip() {
    return new Promise((resolve, reject) => {
        let fromCity = this.event.request.intent.slots.fromCity.value;
        let toCity = this.event.request.intent.slots.toCity.value;
        let duration = this.event.request.intent.slots.duration.value;
        let date = this.event.request.intent.slots.date.value;
        let purpose = this.event.request.intent.slots.purpose.value;

        fromCity = fromCity.split(" ").join("");
        toCity = toCity.split(" ").join("");
        date = new Date(date).getTime() / 1000;

        tripSchema.trip_info.from_city = fromCity;
        tripSchema.trip_info.to_city = toCity;
        tripSchema.trip_info.duration = duration;
        tripSchema.trip_info.date = date;
        tripSchema.trip_info.purpose = purpose;
        tripSchema.trip_info.trip_name = fromCity + "_" + toCity + "_" + date;
        tripSchema.trip_id = fromCity + "_" + toCity + "_" + date;
        console.log('tripSchema', tripSchema);

        generatePackingList(toCity, date, duration)
            .then(list => {
                let count = 0;
                for (var listKey in list) {
                    const len = Object.keys(list[listKey]).length;
                    count += len;
                }
                tripSchema.packing_list = list;
                tripSchema.total_item_count = count;

                resolve(tripSchema);
            }).catch(err => reject);

    });
}

function validateSlots() {
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

module.exports = newTripModeHandler;