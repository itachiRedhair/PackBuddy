'use strict';
var expect = require('chai').expect;
var index = require('./../index');

const context = require('aws-lambda-mock-context');

//events
const packBagIntentYes = require("./events/packBagIntent/packBagIntentYes.json");
const packBagIntentNo = require("./events/packBagIntent/packBagIntentNo.json");
const electronicsCategoryComplete = require("./events/packBagIntent/electronicsCategoryComplete.json");

describe("Testing packBagIntent when user reply with yes for packing to start", function () {
    let speechResponse = null
    let speechError = null

    before(function (done) {
        let ctx = context();
        index.handler(packBagIntentYes, ctx);

        ctx.Promise
            .then(resp => { speechResponse = resp; done(); })
            .catch(err => { speechError = err; done(); })
    })

    describe("The response is structurally correct for Alexa Speech Services", function () {
        it('should not have errored', function () {
            expect(speechError).to.be.null
        })

        it('should have a speechlet response', function () {
            expect(speechResponse.response).not.to.be.null
        })

        it("should have a spoken response", () => {
            expect(speechResponse.response.outputSpeech).not.to.be.null
        })

        // it("should have a correct value for slots given in the launch of newTripIntent",function(){
        //     expect(speechResponse.response.directives[0].updatedIntent.slots.toCity.value).to.equal("Chicago");
        //     expect(speechResponse.response.directives[0].updatedIntent.slots.purpose.value).to.equal("business");
        // })

        it("should not end the alexa session", function() {
            // console.log('speechResponse in pack bagintent yes',speechResponse);
            expect(speechResponse.response.outputSpeech.ssml).to.equal("<speak> What do you want to pack?toiletries, clothing, electronics, Select one. </speak>")
        })

        it("should not end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.false
        })
    })
})

describe("Testing electronics category complete event", function () {
    let speechResponse = null
    let speechError = null

    before(function (done) {
        let ctx = context();
        index.handler(electronicsCategoryComplete, ctx);

        ctx.Promise
            .then(resp => { speechResponse = resp; done(); })
            .catch(err => { speechError = err; done(); })
    })

    describe("The response is structurally correct for Alexa Speech Services", function () {
        it('should not have errored', function () {
            expect(speechError).to.be.null
        })

        it('should have a speechlet response', function () {
            expect(speechResponse.response).not.to.be.null
        })

        it("should have a spoken response", () => {
            expect(speechResponse.response.outputSpeech).not.to.be.null
        })

        // it("should have a correct value for response",function(){
        //     expect(speechResponse.response.outputSpeech.ssml).to.equal("<speak> Ok, see you next time! </speak>");
        // })

        it("should end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })
    })
})