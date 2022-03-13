'use strict';

const stringify = JSON.stringify;
const stringifyPretty = (object) => stringify(object, null, 2);

const sleepMS = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DisplayRequestInfo {

    constructor() {
        this.axiosInstance = axios.create({
            timeout: 1000,
            headers: {
                'axios-version': axios.VERSION
            }
        });
    }

    async fetchRequestInfo() {
        let done = false;
        let fetchTryNumber = 0;

        while (!done) {
            try {
                ++fetchTryNumber;

                const startTimeMS = Date.now();

                const response = await this.axiosInstance.get('/cgi-bin/debug/request_info');

                const roundTripTimeMS = Date.now() - startTimeMS;

                this.handleResponse(roundTripTimeMS, response.data);

                done = true;
            } catch (error) {
                console.error('fetch error:', error);

                const outputPre = document.querySelector('#output');

                outputPre.innerText = `Try number ${fetchTryNumber} to fetch request info failed.`;

                await sleepMS(1000);
            }
        }
    }

    handleResponse(roundTripTimeMS, responseData) {
        const outputPre = document.querySelector('#output');

        let innerText = `Round Trip Time: ${roundTripTimeMS}ms\n`;
        innerText += '\nRequest Fields:\n';
        innerText += `  Method: ${responseData.httpMethod}\n`;
        innerText += `  Protocol: ${responseData.httpProtocol}\n`;
        innerText += `  Host: ${responseData.host}\n`;
        innerText += `  Remote Address: ${responseData.remoteAddress}\n`;
        innerText += `  URL: ${responseData.url}\n`;
        innerText += `  Body Content Length: ${responseData.bodyContentLength}\n`;
        innerText += `  Close: ${responseData.close}\n`;
        innerText += '\nRequest Headers:\n';
        innerText += `${stringifyPretty(responseData.requestHeaders)}`;

        outputPre.innerText = innerText;
    }

    start() {
        this.fetchRequestInfo();
    }
}

const onload = () => {
    new DisplayRequestInfo().start();
}
