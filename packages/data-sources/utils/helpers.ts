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
        console.log(`Successfully fetched ${url}`);
    } catch (error) {
        if (error instanceof AxiosError) {
            // check if there's a retry-after header
            let retryAfter = Number(error.response?.headers['retry-after']);
            if (!isNaN(retryAfter)) {
                // the retry-after value is in seconds, so turn it into ms for use with
                // setTimeout
                retryAfter *= 1000;

                console.warn(`Got 429 when fetching ${url}. Retrying after ${retryAfter}ms...`);

                // wait for the amount of time specified by the response header
                await new Promise((resolve) => setTimeout(resolve, retryAfter));

                // retry fetching the url
                return fetchDocument(url);
            }
        }

        // if the error wasn't handled above, rethrow it
        throw error;
    }
    return document;
}
