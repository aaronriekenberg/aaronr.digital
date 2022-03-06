"use strict";

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
        try {
            const response = await this.axiosInstance.get('/cgi-bin/debug/request_info');

            this.handleResponse(response.data);
        } catch (error) {
            console.error('fetch error:', error);

            const outputPre = document.querySelector("#output");

            outputPre.innerText = 'error fetching request info';
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