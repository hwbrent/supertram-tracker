import axios from 'axios';
import { JSDOM } from 'jsdom';
import fs from 'fs';

import type { Route } from '../routes/routes.d';
import type { Stop, Direction } from './stops.d';
import { Stops as ClassNames } from '../../utils/classNames';
import { Routes as RoutesURLs } from '../../utils/urls';

/**
 * @summary Given a route, this function fetches its list of stops, grouped by direction
 * @param route the route to fetch stops for
 */
async function fetchStops(route: Route): Promise<Direction[]> {
    const { url } = route;
    const response = await axios.get(url.toString());
    const htmlString = response.data;
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;

    const groupings = Array.from(document.getElementsByClassName(ClassNames.GROUPING));

    const directions = await Promise.all(groupings.map(async (grouping) => {
        // get the title, and from it the termini of the route
        const [h2] = grouping.getElementsByTagName('h2');
        const title = h2?.textContent?.trim() || '';
        const [from, to] = title.split(' - ').map((s) => s.trim());

        const [timetable] = grouping.getElementsByClassName(ClassNames.TIMETABLE);
        const trs = Array.from(timetable.getElementsByTagName('tr'));

        // get the basic stop data from the current page
        const basicStops = trs.map((tr) => {
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

            const stop: Stop = { name, href, url };
            return stop;
        });

        // filter the nulls, and fetch additional data for each stop
        const promises = basicStops
            .filter((stop): stop is Stop => stop !== null)
            .map(async (stop) => {
                await augmentStop(stop);
                return stop
            });
        const stops = await Promise.all(promises);

        const direction = {
            from,
            to,
            stops
        };
        return direction;
    }));

    return directions;
}

/**
 * @summary Augments a stop in-place with additional data
 * @param stop the stop to augment
 */
async function augmentStop(stop: Stop): Promise<void> {
    const { url } = stop;
    const response = await axios.get(url.toString());
    const htmlString = response.data;
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;

    // get the div containing the main data
    const content = document.getElementById('content');

    // console.log(content?.outerHTML);
    // console.log('');

    // sanity check to confirm the names match
    const name = content?.getElementsByTagName('h1')[0]?.textContent?.trim() || '';
    console.assert(name === stop.name, `Stop name mismatch: ${name} !== ${stop.name}`);

    // get the description of where the stop is located
    const description = content?.getElementsByTagName('p')[0]?.textContent?.trim() || '';

    // get the horizontal list of other info
    // @ts-ignore
    const [ul] = content.getElementsByTagName('ul');
    const lis = ul.children;
    const [ mapLi, streetViewLi, naptanLi, atcoLi ] = lis;

    // ignore the first <li> - it's a link to the stop in bustimes.org's proprietary map.
    // we want to use google maps instead

    // get the street view link
    const streetViewA = streetViewLi.getElementsByTagName('a')[0];
    const streetViewHref = streetViewA?.href || '';
    const streetViewUrl = new URL(streetViewHref);

    // get the NaPTAN code
    const NaPTAN = naptanLi?.textContent?.trim() || '';

    // get the ATCO code
    const ATCO = atcoLi?.textContent?.trim() || '';

    // extrapolate the latitude and longitude from the street view URL
    const params = streetViewUrl.searchParams;
    const coords = params.get('cbll') || '';
    const [latitude, longitude] = coords.split(',');

    // console.log(stop, description, streetViewUrl, NaPTAN, ATCO, latitude, longitude);

    stop.description = description;
    stop.streetViewUrl = streetViewUrl;
    stop.NaPTAN = NaPTAN;
    stop.ATCO = ATCO;
    stop.latitude = latitude;
    stop.longitude = longitude;
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
