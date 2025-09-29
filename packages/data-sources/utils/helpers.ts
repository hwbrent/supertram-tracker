/**
 * @summary Contains helper functions used across the various modules in the codebase
 * @module helpers
 */

// ===============
// === Imports ===
// ===============

import axios, { AxiosError } from 'axios';
import { JSDOM } from 'jsdom';

// ===============
// === Globals ===
// ===============

/**
 * @summary Responses from axios requests
 * @type {import('axios').AxiosResponse}
 */
const responses = []

// =================
// === Functions ===
// =================

/**
 * @summary Fetches the page at the given URL and returns it as a Document
 * @param url the url of the page to fetch
 * @returns the page as a Document
 */
export async function fetchDocument(url: URL|string): Promise<Document> {
    let document;
    let response;
    let responseNumber;
    let htmlString;
    let dom;
    try {
        // make the request and record it
        response = await axios.get(url.toString());
        responseNumber = responses.push(response);

        // Convert the response data to a Document object
        htmlString = response.data;
        dom = new JSDOM(htmlString);
        document = dom.window.document;
    } catch (error) {
        if (error instanceof AxiosError) {
            const { response, status, code } = error;

            // check if there's a retry-after header
            const retryAfterSecs = Number(response?.headers['retry-after']);
            const hasRetryAfter = !isNaN(retryAfterSecs);
            if (status === 429 && hasRetryAfter) {
                // Add the error response to the responses array
                responseNumber = responses.push(response);

                // the retry-after value is in seconds, so turn it into ms for use with
                // setTimeout
                const retryAfterMs = retryAfterSecs * 1000;

                // add a bit of extra time to be safe
                const retryAfterBuffered = retryAfterMs + 10;

                const message = [
                    `<${responseNumber}>`,
                    `    ${status}`,
                    `    ${code}`,
                    `    ${url}`,
                    `    'retry-after':'${retryAfterSecs}'`,
                    `</${responseNumber}>`
                ].join('\n');
                console.warn(message);

                // wait for the amount of time specified by the response header
                await new Promise((resolve) => setTimeout(resolve, retryAfterBuffered));

                // retry fetching the url
                return fetchDocument(url);
            }
        }

        // if the error wasn't handled above, rethrow it
        throw error;
    }
    return document;
}
