'use strict';

const sleepMS = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CommandRunner {

    #axiosInstance;

    #commandIDToCommandAndArgsString;

    #fetchInfoForCommandIDRunning;

    #pendingFetchInfoCommandID;

    constructor(axiosInstance) {
        this.#axiosInstance = axiosInstance;
        this.#commandIDToCommandAndArgsString = new Map();
        this.#fetchInfoForCommandIDRunning = false;
        this.#pendingFetchInfoCommandID = null;
    }

    async fetchInfoForCommandID(commandID) {
        this.#pendingFetchInfoCommandID = commandID;

        if (this.#fetchInfoForCommandIDRunning) {
            return;
        }

        this.#fetchInfoForCommandIDRunning = true;

        while (this.#pendingFetchInfoCommandID !== null) {
            try {
                const commandIDToFetch = this.#pendingFetchInfoCommandID;
                this.#pendingFetchInfoCommandID = null;

                const response = await this.#axiosInstance.get(`/cgi-bin/commands/${commandIDToFetch}`);

                this.handleFetchInfoForCommandIDResponse(commandIDToFetch, response.data);
            } catch (error) {
                console.error('fetch error:', error);
            }
        }

        this.#fetchInfoForCommandIDRunning = false;
    }

    handleFetchInfoForCommandIDResponse(commandID, responseData) {
        const outputPre = document.querySelector('#output');

        if (!this.#commandIDToCommandAndArgsString.has(commandID)) {
            let commandAndArgsString = responseData.commandInfo.command;
            for (const arg of (responseData.commandInfo.args ?? [])) {
                commandAndArgsString += ` ${arg}`;
            }
            this.#commandIDToCommandAndArgsString.set(commandID, commandAndArgsString);
        }
        const commandAndArgsString = this.#commandIDToCommandAndArgsString.get(commandID);

        let preText = `Now: ${responseData.now}\n\n`;
        preText += `Command Duration: ${responseData.commandDuration}\n\n`;
        preText += `$ ${commandAndArgsString}\n\n`;
        preText += responseData.commandOutput;

        outputPre.innerText = preText;
    }

}

class CommandController {

    #axiosInstance;

    #commandRunner;

    constructor() {
        this.#axiosInstance = axios.create({
            timeout: 5000,
            headers: {
                'axios-version': axios.VERSION
            }
        });
        this.#commandRunner = new CommandRunner(
            this.#axiosInstance
        );
    }

    async fetchInfoForCommandID(commandID) {
        await this.#commandRunner.fetchInfoForCommandID(commandID);
    }

    async fetchAllCommands() {
        let done = false;
        let fetchAllCommandsTryNumber = 0;

        while (!done) {
            try {
                ++fetchAllCommandsTryNumber;

                const response = await this.#axiosInstance.get('/cgi-bin/commands');

                this.handleFetchAllCommandsResponse(response.data);

                done = true;
            } catch (error) {
                console.error('fetch error:', error);

                const commandsDiv = document.querySelector('#commands');
                commandsDiv.innerHTML = `<pre>Try number ${fetchAllCommandsTryNumber} to fetch all commands failed.</pre>`;

                await sleepMS(1000);
            }
        }
    }

    handleFetchAllCommandsResponse(commands) {
        // generate the radio buttons
        const commandsDiv = document.querySelector('#commands');

        let innerHTML = '<ul>\n';
        innerHTML += ((commands ?? []).map((command) =>
            `<li class="radio-button">
               <input type="radio" name="command" value="${command.id}" id="${command.id}">
               <label for="${command.id}">${command.description}</label>
             </li>`)
            .join('\n'));
        innerHTML += '</ul>';

        commandsDiv.innerHTML = innerHTML;

        this.addRadioButtonEventListeners();

        this.startPeriodicCommandInfoFetch();
    }

    addRadioButtonEventListeners() {
        const radioButtons = document.querySelectorAll('input[name="command"]');

        for (const radioButton of radioButtons) {
            const commandRunner = this;
            radioButton.addEventListener('change', function (e) {
                if (this.checked) {
                    const selectedCommandID = this.value;
                    commandRunner.fetchInfoForCommandID(selectedCommandID);
                }
            });
        }
    }

    async startPeriodicCommandInfoFetch() {
        const radioButtons = document.querySelectorAll('input[name="command"]');

        while (true) {
            const nowMS = Date.now();
            const msAfterCurrentSecond = (nowMS % 1000);

            await sleepMS(1000 - msAfterCurrentSecond);

            for (const radioButton of radioButtons) {
                if (radioButton.checked) {
                    const selectedCommandID = radioButton.value;
                    await this.fetchInfoForCommandID(selectedCommandID);
                    break;
                }
            }
        }
    }

    start() {
        this.fetchAllCommands();
    }

}

const commandRunner = new CommandRunner();