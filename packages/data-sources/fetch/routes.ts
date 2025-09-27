import axios from 'axios';
import { JSDOM } from 'jsdom';
import fs from 'fs';

import type { Route } from './routes.d';

enum URLs {
    /** The base URL of the site */
    BASE = "https://bustimes.org",
    /**
     * The page that has hrefs to the routes
     *
     * (Yes the actual URL has a spelling error "yorkhire")
     */
    ROUTES_HOMEPAGE = URLs.BASE + '/operators/south-yorkhire-future-tram'
};

/**
 * @summary Fetches a list of route data
 */
export default async function fetchRoutes(): Promise<Route[]> {
    const response = await axios.get(URLs.ROUTES_HOMEPAGE);
    const htmlString = response.data;
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;

    // There's a <ul> containing the routes called "services"
    const [services] = document.getElementsByClassName('services');

    // Within the <ul> is a list of items, where each item is a route
    const lis = Array.from(services?.children || []);
    const results = lis.map((li) => {
        // Each route has an anchor tag, within which there's obviously an href, but
        // also the name and description of the route
        const [anchor] = li.getElementsByTagName('a');
        const href = anchor?.href || '';
        const name = li.getElementsByClassName('name')[0]?.textContent?.trim()|| '';
        const description = li.getElementsByClassName('description')[0]?.textContent?.trim() || '';

        // create a full URL
        const url = new URL(href, URLs.BASE);

        const routeObj: Route = { href, url, name, description };
        return routeObj;
    });

    return results;
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
    main();
}
