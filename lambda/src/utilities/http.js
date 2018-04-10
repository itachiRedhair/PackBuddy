'use strict';

const fetch = require("node-fetch");
const HttpsProxyAgent = require('https-proxy-agent');

function httpGet(url) {
    return fetch(url, { agent: new HttpsProxyAgent('proxy.tcs.com:8080') });
}

module.exports = { httpGet }