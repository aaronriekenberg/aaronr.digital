"use strict";

class CommandRunner {

    constructor() {
        this.axiosInstance = axios.create({
            timeout: 1000,
            headers: {
                'axios-version': axios.VERSION
            }
        });
        this.fetchAllCommandsTryNumber = 0;
        this.commandIDToCommandAndArgsString = new Map();
    }

    async fetchInfoForCommandID(commandID) {
        try {
            const response = await this.axiosInstance.get(`/cgi-bin/commands/${commandID}`);

            this.handleFetchInfoForCommandIDResponse(commandID, response.data);
        } catch (error) {
            console.error('fetch error:', error);
        }
    }

    handleFetchInfoForCommandIDResponse(commandID, responseData) {
        const outputPre = document.querySelector('#output');

        if (!this.commandIDToCommandAndArgsString.has(commandID)) {
            let commandAndArgsString = responseData.commandInfo.command;
            for (const arg of (responseData.commandInfo.args || [])) {
                commandAndArgsString += ` ${arg}`;
            }
            this.commandIDToCommandAndArgsString.set(commandID, commandAndArgsString);
        }
        const commandAndArgsString = this.commandIDToCommandAndArgsString.get(commandID);

        let preText = `Now: ${responseData.now}\n\n`;
        preText += `Command Duration: ${responseData.commandDuration}\n\n`;
        preText += `$ ${commandAndArgsString}\n\n`;
        preText += responseData.commandOutput;

        outputPre.innerText = preText;
    }

    async fetchAllCommands() {
        try {
            ++this.fetchAllCommandsTryNumber;

            const response = await this.axiosInstance.get('/cgi-bin/commands');

            this.handleFetchAllCommandsResponse(response.data);
        } catch (error) {
            console.error('fetch error:', error);

            const commandsDiv = document.querySelector("#commands");
            commandsDiv.innerHTML = `<pre>Try number ${this.fetchAllCommandsTryNumber} to fetch all commands failed.</pre>`;

            setTimeout(() => {
                this.fetchAllCommands();
            }, 1000);
        }
    }

    handleFetchAllCommandsResponse(commands) {
        // generate the radio buttons
        const commandsDiv = document.querySelector("#commands");

        commandsDiv.innerHTML = (commands || []).map((command) =>
            `<div>
               <input type="radio" name="command" value="${command.id}" id="${command.id}">
               <label for="${command.id}">${command.description}</label>
             </div>`)
            .join('\n');

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

    startPeriodicCommandInfoFetch() {
        const radioButtons = document.querySelectorAll('input[name="command"]');

        setInterval(() => {
            for (const radioButton of radioButtons) {
                if (radioButton.checked) {
                    const selectedCommandID = radioButton.value;
                    this.fetchInfoForCommandID(selectedCommandID);
                    break;
                }
            }
        }, 1000);
    }

    start() {
        this.fetchAllCommands();
    }

}

const onload = () => {
    new CommandRunner().start();
}