'use strict';

const stringify = JSON.stringify;
const stringifyPretty = (object) => stringify(object, null, 2);

const sleepMS = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class JemallocStatsController {

    #axiosInstance;

    #fetchRunning;

    constructor() {
        this.#axiosInstance = axios.create({
            timeout: 5000,
            headers: {
                'axios-version': axios.VERSION
            }
        });
        this.#fetchRunning = false;
    }

    async fetchInfo() {
        if (this.#fetchRunning) {
            return;
        }

        let done = false;
        let fetchTryNumber = 0;

        this.#fetchRunning = true;
        while (!done) {
            try {
                ++fetchTryNumber;

                const startTimeMS = Date.now();

                const response = await this.#axiosInstance.get('/cgi-bin/jemalloc_stats');

                const roundTripTimeMS = Date.now() - startTimeMS;

                this.#handleResponse(roundTripTimeMS, response);

                done = true;
            } catch (error) {
                console.error('fetch error:', error);

                const outputPre = document.querySelector('#output');

                outputPre.innerText = `Try number ${fetchTryNumber} to fetch info failed.`;

                await sleepMS(1000);
            }
        }
        this.#fetchRunning = false;
    }

    #handleResponse(roundTripTimeMS, response) {
        const responseData = response.data;

        const outputPre = document.querySelector('#output');

        let innerText = 'jemalloc stats:\n';
        innerText += `${stringifyPretty(responseData)}`;

        outputPre.innerText = innerText;
    }
}

const controller = new JemallocStatsController();
