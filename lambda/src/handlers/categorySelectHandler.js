'use strict';

var Alexa = require("alexa-sdk");
var ddb = require('./../utilities/ddbController');

const getNotPackedCategories=require("./../utilities/packingListController").getNotPackedCategories;

//constants
const states = require("./../constants").states;
const session = require("./../constants").session;
const packingStatus = require("./../constants").packingStatus

const categorySelectHandlers = Alexa.CreateStateHandler(states.CATEGORY_SELECT, {

    'NewSession': function () {
        //do some handling and emit list category intent
        this.emitWithState("ListCategoryIntent");
    },

    'ListCategoryIntent': function(){
        //get list from getPackingCategories() method in packinglistcontroller
         let categories=getNotPackedCategories.call(this);

         let message='';

        if(categories.length){
            let packingList=this.attributes[session.CURRENT_PACKING_LIST];
            let totalPackingStatus=this.attributes[session.CURRENT_TOTAL_PACKING_STATUS];

            message = "What do you want to pack";

            if(totalPackingStatus === packingStatus.NOT_STARTED){
                message+=" ? "
                categories.forEach(category => {
                    message += packingList[category].name+", ";
                });
                message += "Select one."

                this.response.speak(message).listen(message);
                this.emit(":responseReady");
            }else{
                this.response.speak(message+ " now?").listen(message);
                this.emit(":responseReady");
            }
        }else{
            this.handler.state=states.PACKING;
            this.emit("PackingCompleteIntent");
        }


    },

    'SelectCategoryIntent': function(){
        //get value in slot and emit pack Bag intent with current category session attribute
        let selectedCategory=this.event.request.intent.slots.selectedCategory.value;
        let packingList=this.attributes[session.CURRENT_PACKING_LIST];
        // this.response.speak("Let's start packing your " + packingList[selectedCategory].name);
        this.attributes[session.CURRENT_PACKING_CATEGORY_KEY]=selectedCategory;
        this.attributes[session.CURRENT_CATEGORY_PACKING_STATUS]=packingStatus.IN_PROGRESS;
        this.attributes[session.CURRENT_TOTAL_PACKING_STATUS]=packingStatus.IN_PROGRESS;
        this.handler.state=states.PACKING;
        this.emitWithState("PackNewCategoryIntent");
    },


    'AMAZON.HelpIntent': function () {
        const message = "Try saying let's pack clothes ";
        this.response.speak(message)
            .listen(message);
        this.emit(':responseReady');
    },

    'AMAZON.YesIntent': function () {

    },

    'AMAZON.NoIntent': function () {

    },

    'AMAZON.StopIntent': function () {
        clearState.call(this);
        ddb.updatePackingList.call(this);
        this.response.speak("Good Bye");
        this.emit(":responseReady");
    },

    'SessionEndedRequest': function () {
        clearState.call(this);
        ddb.updatePackingList.call(this);
        this.emit(':saveState', true)
    },

    'Unhandled': function () {
        const message = "let's pack clothes";
        this.response.speak(message)
            .listen(message);
        this.emit(':responseReady');
    }
});

function clearState() {
    this.handler.state = '' // delete this.handler.state might cause reference errors
    delete this.attributes['STATE'];
}


module.exports = categorySelectHandlers;