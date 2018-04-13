'use strict';
var expect = require('chai').expect;
var index = require('./../index');

const context = require('aws-lambda-mock-context');


//events
const invocationEvent = require("./events/invocation/invocation.json")
const invocationEventYes = require("./events/invocation/invocationReplyYes.json")
const invocationEventNo = require("./events/invocation/invocationReplyNo.json")

describe("Testing an invocation", function () {
    let speechResponse = null
    let speechError = null

    before(function (done) {
        let ctx = context();
        index.handler(invocationEvent, ctx);

        ctx.Promise
            .then(resp => { speechResponse = resp; done(); })
            .catch(err => { speechError = err; done(); })
    })

    describe("The invocation response is structurally correct for Alexa Speech Services", function () {
        it('should not have errored', function () {
            expect(speechError).to.be.null
        })

        it('should have a speechlet response', function () {
            expect(speechResponse.response).not.to.be.null
        })

        it("should have a spoken response", () => {
            expect(speechResponse.response.outputSpeech).not.to.be.null
        })

        it("should have correct spoken response",()=>{
            expect(speechResponse.response.outputSpeech.ssml).to.equal("<speak> Hi I am Pack Buddy. It seems you are not done with your last packing? Do you want to resume it or start with the new one? </speak>")
        })

        it("should not end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.false
        })
    })
})

describe("Testing 'yes' response for invocation", function () {
    let speechResponse = null
    let speechError = null

    before(function (done) {
        let ctx =context();
        index.handler(invocationEventYes, ctx);

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

        it("should have correct spoken response",()=>{
            expect(speechResponse.response.outputSpeech.ssml).to.equal("<speak> Tell me about your trip. Where are you going? </speak>")
        })

        it("should not end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.false
        })
    })
})

describe("Testing 'no' response for invocation", function () {
    let speechResponse = null
    let speechError = null

    before(function (done) {
        let ctx =context();
        index.handler(invocationEventNo, ctx);

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

        it("should have correct spoken response",()=>{
            expect(speechResponse.response.outputSpeech.ssml).to.equal("<speak> Ok, see you next time! </speak>")
        })

        it("should end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })
    })
})