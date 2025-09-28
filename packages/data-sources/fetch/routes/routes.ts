import fs from 'fs';

import type { Route } from './routes.d';
import { Routes as URLs } from '../../utils/urls';
import { Routes as ClassNames } from '../../utils/classNames';

import { fetchDocument } from '../../utils/helpers';

/** @enum {string} */
const Paths = {
    JSON: __dirname + '/routes.json'
};

/**
 * @summary Fetches a list of route data
 */
export async function fetchRoutes(): Promise<Route[]> {
    const document = await fetchDocument(URLs.HOMEPAGE);

    // There's a <ul> containing the routes called "services"
    const [services] = document.getElementsByClassName(ClassNames.SERVICES);

    // Within the <ul> is a list of items, where each item is a route
    const lis = Array.from(services?.children || []);
    const results = lis.map((li) => {
        // Each route has an anchor tag, within which there's obviously an href, but
        // also the name and description of the route
        const [anchor] = li.getElementsByTagName('a');
        const href = anchor?.href || '';
        const name = li.getElementsByClassName(ClassNames.NAME)[0]?.textContent?.trim()|| '';
        const description = li.getElementsByClassName(ClassNames.DESCRIPTION)[0]?.textContent?.trim() || '';

        // create a full URL
        const url = new URL(href, URLs.BASE);

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
