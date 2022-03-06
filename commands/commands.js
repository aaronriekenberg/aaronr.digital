"use strict";

const axiosInstance = axios.create({
    timeout: 1000,
    headers: {
      'axios-version': axios.VERSION
    }
  });

  const fetchInfoForCommandID = async (commandID) => {
    try {
      const response = await axiosInstance.get(`/cgi-bin/commands/${commandID}`);

      handleFetchInfoForCommandIDResponse(response.data);
    } catch (error) {
      console.error('fetch error:', error);
    }
  }

  const handleFetchInfoForCommandIDResponse = (responseData) => {
    const outputPre = document.querySelector('#output');

    let commandAndArgsString = responseData.commandInfo.command;
    for (const arg of (responseData.commandInfo.args || [])) {
      commandAndArgsString += ` ${arg}`;
    }

    let preText = `Now: ${responseData.now}\n\n`;
    preText += `Command Duration: ${responseData.commandDuration}\n\n`;
    preText += `$ ${commandAndArgsString}\n\n`;
    preText += responseData.commandOutput;

    outputPre.innerText = preText;
  }

  let fetchAllCommandsTryNumber = 0;

  const fetchAllCommands = async () => {
    try {
      ++fetchAllCommandsTryNumber;

      const response = await axiosInstance.get('/cgi-bin/commands');

      handleFetchAllCommandsResponse(response.data);
    } catch (error) {
      console.error('fetch error:', error);

      const commandsDiv = document.querySelector("#commands");
      commandsDiv.innerHTML = `<pre>Try number ${fetchAllCommandsTryNumber} to fetch all commands failed.</pre>`;

      setTimeout(() => {
        fetchAllCommands();
      }, 1000);
    }
  }

  const handleFetchAllCommandsResponse = (commands) => {
    // generate the radio buttons
    const commandsDiv = document.querySelector("#commands");

    commandsDiv.innerHTML = (commands || []).map((command) => 
       `<div>
          <input type="radio" name="command" value="${command.id}" id="${command.id}">
          <label for="${command.id}">${command.description}</label>
        </div>`)
      .join(' ');

    const radioButtons = document.querySelectorAll('input[name="command"]');

    for (const radioButton of radioButtons) {
      radioButton.addEventListener('change', function (e) {
        if (this.checked) {
          const selectedCommandID = radioButton.value;
          fetchInfoForCommandID(selectedCommandID);
        }
      });
    }

    setInterval(() => {
      for (const radioButton of radioButtons) {
        if (radioButton.checked) {
          const selectedCommandID = radioButton.value;
          fetchInfoForCommandID(selectedCommandID);
          break;
        }
      }
    }, 1000);
  }

  const onload = () => {
    fetchAllCommands();
  }