var Alexa = require("alexa-sdk");
const constants = require("./../constants");
var ddb = require("./../utilities/ddbController");

const newTripModeHandler = Alexa.CreateStateHandler(constants.states.NEW_TRIP, {

    'NewSession': function () {
        const message = "Tell me about your trip. Where are you going or when will you be leaving?";
        this.response.speak(message).listen("You can say I am going to Washington");
        this.emit(":responseReady");
    },

    'NewTripIntent': function () {
        var filledSlots = delegateSlotCollection.call(this);
        //Now let's recap the trip
        this.attributes['fromCity'] = this.event.request.intent.slots.fromCity.value;
        this.attributes['toCity'] = this.event.request.intent.slots.toCity.value;
        this.attributes['duration'] = this.event.request.intent.slots.duration.value;
        this.attributes['date'] = this.event.request.intent.slots.date.value;
        this.attributes['purpose'] = this.event.request.intent.slots.purpose.value;
        // speechOutput= " from " + fromCity + " to " + toCity + " on " + date + " for " + duration + " days " + " for " + purpose;

        //say the results
        // this.response.speak(speechOutput);
        // this.emit(":responseReady");

        this.handler.state = constants.states.PACKING;

        var userId = this.event.session.user.userId;

        ddb.insertOrUpdateDDB(userId).then(data => {
            console.log('data of dynamodb', data);
            this.emitWithState("NewSession");
        }).catch(error => {
            console.log('error of dynamodb', error);
        });


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


module.exports = newTripModeHandler;