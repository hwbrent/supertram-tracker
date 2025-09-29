/**
 * @summary Contains helper functions used across the various modules in the codebase
 * @module helpers
 */

// ===============
// === Imports ===
// ===============

import axios, { AxiosError } from 'axios';
import { JSDOM } from 'jsdom';

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
    let htmlString;
    let dom;
    try {
        response = await axios.get(url.toString());
        htmlString = response.data;
        dom = new JSDOM(htmlString);
        document = dom.window.document;
    } catch (error) {
        if (error instanceof AxiosError) {
            // check if there's a retry-after header
            const retryAfterSecs = Number(error.response?.headers['retry-after']);
            if (!isNaN(retryAfterSecs)) {
                // the retry-after value is in seconds, so turn it into ms for use with
                // setTimeout
                const retryAfterMs = retryAfterSecs * 1000;

                // add a bit of extra time to be safe
                const retryAfterBuffered = retryAfterMs + 10;

                console.warn(`Got 429 when fetching ${url}, 'retry-after':'${retryAfterSecs}'\nRetrying after ${retryAfterBuffered}ms...`);

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
