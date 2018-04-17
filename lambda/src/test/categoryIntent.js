'use strict';
var expect = require('chai').expect;
var index = require('./../index');

const context = require('aws-lambda-mock-context');

//events
const selectCategoryIntent = require("./events/categoryIntent/selectCategoryIntent.json");

describe("Testing selectCategoryIntent when user replies with category", function () {
    let speechResponse = null
    let speechError = null

    before(function (done) {
        let ctx = context();
        index.handler(selectCategoryIntent, ctx);

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


        it("should not have correct spoken response", function() {
            // console.log('speechResponse in pack bagintent yes',speechResponse);
            expect(speechResponse.response.outputSpeech.ssml).to.include("phone charger")
        })

        it("should not end the alexa session", function() {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.false
        })
    })
})
