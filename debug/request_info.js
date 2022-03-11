"use strict";

const stringify = JSON.stringify;
const stringifyPretty = (object) => stringify(object, null, 2);

class DisplayRequestInfo {

    constructor() {
        this.axiosInstance = axios.create({
            timeout: 1000,
            headers: {
                'axios-version': axios.VERSION
            }
        });
        this.fetchTryNumber = 0;
    }

    async fetchRequestInfo() {
        try {
            ++this.fetchTryNumber;

            const response = await this.axiosInstance.get('/cgi-bin/debug/request_info');

            this.handleResponse(response.data);
        } catch (error) {
            console.error('fetch error:', error);

            const outputPre = document.querySelector("#output");

            outputPre.innerText = `Try number ${this.fetchTryNumber} to fetch all commands failed.`;

            setTimeout(() => {
                this.fetchRequestInfo();
            }, 1000);
        }
    }

    handleResponse(response) {
        const outputPre = document.querySelector("#output");

        let innerText = `Method: ${response.httpMethod}\n`;
        innerText += `Protocol: ${response.httpProtocol}\n`;
        innerText += `Host: ${response.host}\n`;
        innerText += `Remote Address: ${response.remoteAddress}\n`;
        innerText += `URL: ${response.url}\n`;
        innerText += `Body Content Length: ${response.bodyContentLength}\n`;
        innerText += `Close: ${response.close}\n`;
        innerText += '\nRequest Headers:\n';
        innerText += `${stringifyPretty(response.requestHeaders)}`;

        outputPre.innerText = innerText;
    }

    start() {
        this.fetchRequestInfo();
    }
}

const onload = () => {
    new DisplayRequestInfo().start();
}
