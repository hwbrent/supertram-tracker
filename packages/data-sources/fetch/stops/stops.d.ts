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
    /**
     * @summary A description of the stop, usually including the street it's on
     * @example "On Eckington Way, near Park and Ride - Jct Station Road"
     */
    description?: string;
    /**
     * @summary A Google Street View URL showing the stop
     * @example "https://www.google.com/maps?layer=c&cbll=53.3285345,-1.3443136"
     */
    streetViewUrl?: URL;
    /**
     * @summary The NaPTAN code of the stop
     * @example "37090161"
     * @see {@link https://www.gov.uk/government/publications/national-public-transport-access-node-schema/html-version-of-schema}
     */
    NaPTAN?: string;
    /**
     * @summary The ATCO code of the stop
     * @example "9400ZZSYHFW1"
     * @see {@link https://www.gov.uk/government/publications/national-public-transport-access-node-schema/naptan-guide-for-data-managers}
     */
    ATCO?: string;
    /**
     * @summary The latitude of the stop
     * @example "53.3285909"
     */
    latitude?: string;
    /**
     * @summary The longitude of the stop
     * @example "-1.3444743"
     */
    longitude?: string;
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
