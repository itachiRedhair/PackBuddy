var expect = require('chai').expect;
var index = require('./../index');

const context = require('aws-lambda-mock-context');
const ctx = context();

//events
const inocationEvent = require("./events/invocation.json")

describe("Testing an invocation", function () {
    var speechResponse = null
    var speechError = null

    before(function (done) {
        index.handler(inocationEvent, ctx);

        ctx.Promise
            .then(resp => { speechResponse = resp; done(); })
            .catch(err => { speechError = err; done(); })
    })

    describe("The response is structurally correct for Alexa Speech Services", function () {
        it('should not have errored', function () {
            expect(speechError).to.be.null
        })

        it('should have a version', function () {
            expect(speechResponse.version).not.to.be.null
        })

        it('should have a speechlet response', function () {
            expect(speechResponse.response).not.to.be.null
        })

        it("should have a spoken response", () => {
            expect(speechResponse.response.outputSpeech).not.to.be.null
        })

        it("should end the alexa session", function () {
            expect(speechResponse.response.shouldEndSession).not.to.be.null
            expect(speechResponse.response.shouldEndSession).to.be.true
        })
    })
})