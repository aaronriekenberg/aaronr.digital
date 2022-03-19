'use strict';

const stringify = JSON.stringify;
const stringifyPretty = (object) => stringify(object, null, 2);

const sleepMS = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DisplayRequestInfo {

    constructor() {
        this.axiosInstance = axios.create({
            timeout: 5000,
            headers: {
                'axios-version': axios.VERSION
            }
        });
        this.fetchRunning = false;
    }

    async fetchRequestInfo() {
        if (this.fetchRunning) {
            return;
        }

        let done = false;
        let fetchTryNumber = 0;

        this.fetchRunning = true;
        while (!done) {
            try {
                ++fetchTryNumber;

                const startTimeMS = Date.now();

                const response = await this.axiosInstance.get('/cgi-bin/debug/request_info');

                const roundTripTimeMS = Date.now() - startTimeMS;

                this.handleResponse(roundTripTimeMS, response);

                done = true;
            } catch (error) {
                console.error('fetch error:', error);

                const outputPre = document.querySelector('#output');

                outputPre.innerText = `Try number ${fetchTryNumber} to fetch request info failed.`;

                await sleepMS(1000);
            }
        }
        this.fetchRunning = false;
    }

    handleResponse(roundTripTimeMS, response) {
        const responseData = response.data;
        const responseHeaders = response.headers;
        const responseStatus = response.status;

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
        innerText += `${stringifyPretty(responseData.requestHeaders)}\n`;
        innerText += `\nResponse Status: ${responseStatus}\n`;
        innerText += '\nResponse Headers:\n';
        innerText += `${stringifyPretty(responseHeaders)}`;

        outputPre.innerText = innerText;
    }
}

const displayRequestInfo = new DisplayRequestInfo();
