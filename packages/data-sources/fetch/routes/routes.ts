import axios from 'axios';
import { JSDOM } from 'jsdom';
import fs from 'fs';

import type { Route } from './routes.d';
import { URLs, ClassNames } from '../../utils/consts';

/** @enum {string} */
const Paths = {
    JSON: __dirname + '/routes.json'
};

/**
 * @summary Fetches a list of route data
 */
export async function fetchRoutes(): Promise<Route[]> {
    const response = await axios.get(URLs.ROUTES_HOMEPAGE);
    const htmlString = response.data;
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;

    // There's a <ul> containing the routes called "services"
    const [services] = document.getElementsByClassName(ClassNames.ROUTES_SERVICES);

    // Within the <ul> is a list of items, where each item is a route
    const lis = Array.from(services?.children || []);
    const results = lis.map((li) => {
        // Each route has an anchor tag, within which there's obviously an href, but
        // also the name and description of the route
        const [anchor] = li.getElementsByTagName('a');
        const href = anchor?.href || '';
        const name = li.getElementsByClassName(ClassNames.ROUTES_NAME)[0]?.textContent?.trim()|| '';
        const description = li.getElementsByClassName(ClassNames.ROUTES_DESCRIPTION)[0]?.textContent?.trim() || '';

        // create a full URL
        const url = new URL(href, URLs.ROUTES_BASE);

        const route: Route = { href, url, name, description };
        return route;
    });

    return results;
}

/**
 * @returns routes from the JSON file
 */
export default function getRoutes(): Route[] {
    const data = fs.readFileSync(Paths.JSON, 'utf-8');
    const routes = JSON.parse(data);
    return routes;
}

async function main() {
    // scrape routes
    const routes = await fetchRoutes();

    // do nothing if no routes found
    if (routes.length === 0) {
        return;
    }

    // sort alphabetically by name
    routes.sort((a, b) => a.name.localeCompare(b.name));

    // write to file
    const data = JSON.stringify(routes, null, 4);
    const path = `${__dirname}/routes.json`;
    fs.writeFileSync(path, data);

    console.log('routes:\n', data);
}

if (require.main === module) {
    // main();
    console.log(getRoutes());
}
