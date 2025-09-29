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
        // If we get a 429 with a retry-after value, wait however long it says to, and
        // then try again
        if (error instanceof AxiosError) {
            const retryAfter = Number(error.response?.headers['retry-after']);
            if (!isNaN(retryAfter)) {
                await new Promise((resolve) => setTimeout(resolve, retryAfter));
                return fetchDocument(url); // retry
            }
        }

        // if the error wasn't handled above, rethrow it
        throw error;
    }
    return document;
}
