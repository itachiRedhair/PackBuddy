'use strict';
var expect = require('chai').expect;
var index = require('./../index');

const context = require('aws-lambda-mock-context');

//events
const newTripIntent = require("./events/newTripIntent/newTripIntentLaunch.json");
const newTripIntentInProgress = require("./events/newTripIntent/newTripIntentInProgress.json");

describe("Testing newTripIntent launch", function () {
    let speechResponse = null
    let speechError = null

    before(function (done) {
        let ctx = context();
        index.handler(newTripIntent, ctx);

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

        it("should have a correct value for slots given in the launch of newTripIntent",function(){
            expect(speechResponse.response.directives[0].updatedIntent.slots.toCity.value).to.equal("Chicago");
            expect(speechResponse.response.directives[0].updatedIntent.slots.purpose.value).to.equal("business");
        })

        it("should not end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.false
        })
    })
})

describe("Testing newTripIntent InProgress", function () {
    let speechResponse = null
    let speechError = null

    before(function (done) {
        let ctx = context();
        index.handler(newTripIntentInProgress, ctx);

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

        it("should have a correct directive",function(){
            expect(speechResponse.response.directives[0].type).to.equal("Dialog.Delegate");
        })

        it("should not end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.false
        })
    })
})

// describe("Testing 'yes' response for invocation", function () {
//     let speechResponse = null
//     let speechError = null

//     before(function (done) {
//         let ctx =context();
//         index.handler(invocationEventYes, ctx);

//         ctx.Promise
//             .then(resp => { speechResponse = resp; done(); })
//             .catch(err => { speechError = err; done(); })
//     })

//     describe("The response is structurally correct for Alexa Speech Services", function () {
//         it('should not have errored', function () {
//             expect(speechError).to.be.null
//         })

//         it('should have a speechlet response', function () {
//             expect(speechResponse.response).not.to.be.null
//         })

//         it("should have a spoken response", () => {
//             expect(speechResponse.response.outputSpeech).not.to.be.null
//         })

//         it("should have correct spoken response",()=>{
//             expect(speechResponse.response.outputSpeech.ssml).to.equal("<speak> Tell me about your trip. Where are you going? </speak>")
//         })
//     })
// })

// describe("Testing 'no' response for invocation", function () {
//     let speechResponse = null
//     let speechError = null

//     before(function (done) {
//         let ctx =context();
//         index.handler(invocationEventNo, ctx);

//         ctx.Promise
//             .then(resp => { speechResponse = resp; done(); })
//             .catch(err => { speechError = err; done(); })
//     })

//     describe("The response is structurally correct for Alexa Speech Services", function () {
//         it('should not have errored', function () {
//             expect(speechError).to.be.null
//         })

//         it('should have a speechlet response', function () {
//             expect(speechResponse.response).not.to.be.null
//         })

//         it("should have a spoken response", () => {
//             expect(speechResponse.response.outputSpeech).not.to.be.null
//         })

//         it("should have correct spoken response",()=>{
//             expect(speechResponse.response.outputSpeech.ssml).to.equal("<speak> Ok, see you next time! </speak>")
//         })
//     })
// })