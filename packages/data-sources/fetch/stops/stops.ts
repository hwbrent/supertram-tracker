import axios from 'axios';
import { JSDOM } from 'jsdom';
import fs from 'fs';

import type { Route } from '../routes/routes.d';
import { Stops as ClassNames } from '../../utils/classNames';
import { Routes as RoutesURLs } from '../../utils/urls';

/**
 * 
 * @param route the route to fetch stops for
 */
async function fetchStops(route: Route) {
    const { url } = route;
    const response = await axios.get(url.toString());
    const htmlString = response.data;
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;

    const groupings = Array.from(document.getElementsByClassName(ClassNames.GROUPING));

    const directions = groupings.map((grouping) => {
        // get the title, and from it the termini of the route
        const [h2] = grouping.getElementsByTagName('h2');
        const title = h2?.textContent?.trim() || '';
        const [from, to] = title.split(' - ').map((s) => s.trim());

        const [timetable] = grouping.getElementsByClassName(ClassNames.TIMETABLE);
        const trs = Array.from(timetable.getElementsByTagName('tr'));
        const stops = trs
            .map((tr) => {
                // skip hidden rows in the table
                const isHidden = tr.classList.contains('minor');
                if (isHidden) {
                    return null;
                }

                // get the <th>. this is what contains the data we want
                const [th] = tr.getElementsByTagName('th');

                // get the name of the stop
                const name = th.textContent?.trim() || '';

                // get the href to the stop's page
                const [a] = th.getElementsByTagName('a');
                const href = a?.href || '';

                // get an absolute URL from the href
                const url = new URL(href, RoutesURLs.BASE);

                const stop = { name, href, url };
                return stop;
            })
            .filter(Boolean);

        const direction = {
            from,
            to,
            stops
        };
        return direction;
    });

    return directions;
}

async function main() {
    const route: Route = {
        name: '',
        description: '',
        href: '',
        url: new URL('https://bustimes.org/services/blue-malin-bridge-cathedral')
    };
    const directions = await fetchStops(route);
    console.log(JSON.stringify(directions, null, 4));
}

if (require.main === module) {
    main();
}
