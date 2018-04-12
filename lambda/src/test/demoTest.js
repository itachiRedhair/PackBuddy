// 'use strict';
// var expect = require('chai').expect;
// var index = require('./../index');

// const context = require('aws-lambda-mock-context');

// //events
// const demoEvent = require("./events/demoEvent.json");

// describe("Testing demoEvnent", function () {
//     let speechResponse = null
//     let speechError = null

//     before(function (done) {
//         let ctx = context();
//         index.handler(demoEvent, ctx);

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
//             // console.log(speechResponse)
//             expect(speechResponse.response.outputSpeech).not.to.be.null
//         })

//         ("should not end the alexa session", function() {
//             expect(speechResponse.response.shouldEndSession).not.to.be.null
//             expect(speechResponse.response.shouldEndSession).to.be.false
//         })
//     })
// })
