export type Stop = {
    /**
     * @summary The name of the stop
     * @example "Halfway To City"
     */
    name: string;
    /**
     * @summary The partial URL that leads to more details about the stop (timetable etc)
     * @example "/stops/9400ZZSYHFW1"
     */
    href: string;
    /**
     * @summary The full URL corresponding to `href`
     * @example "https://bustimes.org/stops/9400ZZSYHFW1"
     */
    url: URL;
};

export type Direction = {
    /**
     * @summary The name of the stop where this direction starts
     * @example "Malin Bridge"
     */
    from: string;
    /**
     * @summary The name of the stop where this direction ends
     * @example "Halfway"
     */
    to: string;
    /**
     * @summary An ordered list of stops stopped at in this direction
     */
    stops: Stop[];
};
