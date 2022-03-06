"use strict";

const axiosInstance = axios.create({
    timeout: 1000,
    headers: {
        'axios-version': axios.VERSION
    }
});

const fetchRequestInfo = async () => {
    try {
        const response = await axiosInstance.get('/cgi-bin/debug/request_info');

        handleResponse(response.data);
    } catch (error) {
        console.error('fetch error:', error);

        const outputPre = document.querySelector("#output");

        outputPre.innerText = 'error fetching request info';
    }
}

const handleResponse = (response) => {
    const outputPre = document.querySelector("#output");

    outputPre.innerText = response.requestInfo;
}

const onload = () => {
    fetchRequestInfo();
}