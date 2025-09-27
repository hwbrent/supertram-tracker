import axios from 'axios';
import { JSDOM } from 'jsdom';

import type { Route } from './routes.d';

enum URLs {
    /**
     * The page that has hrefs to the routes
     *
     * (Yes the actual URL has a spelling error "yorkhire")
     */
    ROUTES_HOMEPAGE = 'https://bustimes.org/operators/south-yorkhire-future-tram'
};

/**
 * @summary Fetches a list of route data
 */
export default async function getRoutes(): Promise<Route[]> {
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

        const routeObj: Route = { href, name, description };
        return routeObj;
    });

    return results;
}

async function main() {
    const routes = await getRoutes();
    const string = JSON.stringify(routes, null, 4);
    console.log('routes:\n', string);
}

if (require.main === module) {
    main();
}
