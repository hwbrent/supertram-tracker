import axios from 'axios';
import { JSDOM } from 'jsdom';

/**
 * @summary Fetches the page at the given URL and returns it as a Document
 * @param url the url of the page to fetch
 * @returns the page as a Document
 */
export async function fetchDocument(url: URL|string): Promise<Document> {
    const response = await axios.get(url.toString());
    const htmlString = response.data;
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;
    return document;
}
