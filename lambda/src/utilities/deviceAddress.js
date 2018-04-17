'use strict';

// const fetch = require("node-fetch");
const Https = require('https');

class AlexaDeviceAddressClient {

    constructor(apiEndpoint, deviceId, consentToken) {
        // console.log("Creating AlexaAddressClient instance.");
        this.deviceId = deviceId;
        this.consentToken = consentToken;
        this.endpoint = apiEndpoint.replace(/^https?:\/\//i, "");
    }

    getCityFromDeviceAddress() {
        const options = this.getRequestOptions(`/v1/devices/${this.deviceId}/settings/address`);

        return new Promise((resolve, reject) => {
            this.handleDeviceAddressApiRequest(options, resolve, reject);
        });
    }

    handleDeviceAddressApiRequest(requestOptions, resolve, reject) {
        Https.get(requestOptions, (response) => {
            // console.log(`Device Address API responded with a status code of : ${response.statusCode}`);

            switch (response.statusCode) {
                case 200:
                    // console.log("Address successfully retrieved, now responding to user.");
                    response.on('data', (data) => {
                        let responsePayloadObject = JSON.parse(data);
                        // console.log('successfully got response from device address', responsePayloadObject);
                        resolve(responsePayloadObject.city);
                    });
                    break;
                case 204:
                    // This likely means that the user didn't have their address set via the companion app.
                    // console.log("Successfully requested from the device address API, but no address was returned.");
                    resolve(null);
                    break;
                case 403:
                    // console.log("The consent token we had wasn't authorized to access the user's address.");
                    resolve(null);
                    break;
                default:
                    // console.log('in default');
                    resolve(null);
            }

        }).on('error', (err) => {
            // console.log(err);
            reject();
        });
    }

    getRequestOptions(path) {
        return {
            hostname: this.endpoint,
            path: path,
            method: 'GET',
            'headers': {
                'Authorization': 'Bearer ' + this.consentToken
            }
        };
    }

}

module.exports = AlexaDeviceAddressClient;