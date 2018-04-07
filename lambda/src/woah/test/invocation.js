'use strict';
var expect = require('chai').expect;
var index = require('./../index');

const context = require('aws-lambda-mock-context');


//events
const invocationEvent = require("./events/invocation.json")
const invocationEventYes = require("./events/invocationReplyYes.json")
const invocationEventNo = require("./events/invocationReplyNo.json")

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
            expect(speechResponse.response.outputSpeech.ssml).to.equal("<speak> Hi I am Pack Buddy. Do you want help with packing? </speak>")
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
    })
})