"use strict";

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

        outputPre.innerText = response.requestInfo;
    }

    start() {
        this.fetchRequestInfo();
    }
}

const onload = () => {
    new DisplayRequestInfo().start();
}