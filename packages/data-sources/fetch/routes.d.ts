/**
 * @summary An object containing data on an individual route within the tram network
 */
type Route = {
    /**
     * @summary The overall name of the route
     * @example "PURP"
     */
    name: string;
    /**
     * @summary A brief description of the route
     * @example "Herdings Park - Cathedral"
     */
    description: string;
    /**
     * @summary The full URL that leads to more details about the route (timetable etc)
     * @example "https://bustimes.org/services/purp-park-hill-sheffield-herdings"
     */
    href: string;
}

export type { Route };
