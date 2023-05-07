import globals from "./globals";
import { sessionToken } from "./sessionManager";

/**
 * @typedef {object} defaultApiResponse
 * @property {boolean} success Whether or not the API request was executed successfully.
 * @property {string[]} message An array of messages related to the API request.
 */

/**
 * @typedef {object} httpPostOutput
 * @property {XMLHttpRequest} xhr The raw XHR object.
 * @property {defaultApiResponse} response The API response.
 */

/**
 * Perform an HTTP POST request to the given endpoint with the given body.
 * @param {string} endpoint
 * @param {object} body
 * @param {boolean?} authenticated
 * @returns {Promise<httpPostOutput>}
 */
export function httpPost(endpoint, body, authenticated = false) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.withCredentials = false;

        xhr.addEventListener("readystatechange", () => {
            if (xhr.readyState === 4) {
                resolve({ xhr: xhr, response: JSON.parse(xhr.responseText) });
            }
        });

        xhr.addEventListener("timeout", () => {
            // TODO: Show failure alert
        });

        xhr.open("POST", `${globals.url}/${endpoint}`);
        if (authenticated) xhr.setRequestHeader("Session-Token", sessionToken);
        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.send(JSON.stringify(body));

        xhr.timeout = 6000;
    });
}
