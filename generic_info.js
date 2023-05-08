'use strict';

const stringify = JSON.stringify;
const stringifyPretty = (object) => stringify(object, null, 2);

const sleepMS = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GenericInfoController {

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

    async fetchInfo(urlPath) {
        if (this.#fetchRunning) {
            return;
        }

        let done = false;
        let fetchTryNumber = 0;

        this.#fetchRunning = true;
        while (!done) {
            try {
                ++fetchTryNumber;

                const response = await this.#axiosInstance.get(urlPath);

                this.#handleResponse(response);

                done = true;
            } catch (error) {
                console.error('fetch error:', error);

                const outputPre = document.querySelector('#output');

                outputPre.scrollLeft = 0;
                outputPre.innerText = `Try number ${fetchTryNumber} to fetch info failed.`;
                outputPre.removeAttribute("hidden");

                await sleepMS(1000);
            }
        }
        this.#fetchRunning = false;
    }

    #handleResponse(response) {
        const outputPre = document.querySelector('#output');

        const innerText = `${stringifyPretty(response.data)}`;

        outputPre.scrollLeft = 0;
        outputPre.innerText = innerText;
        outputPre.removeAttribute("hidden");
    }
}

const controller = new GenericInfoController();
