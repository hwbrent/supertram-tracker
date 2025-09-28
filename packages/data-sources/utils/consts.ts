export enum URLs {
    /** The base URL of the site */
    ROUTES_BASE = "https://bustimes.org",
    /**
     * The page that has hrefs to the routes
     *
     * (Yes the actual URL has a spelling error "yorkhire")
     */
    ROUTES_HOMEPAGE = URLs.ROUTES_BASE + '/operators/south-yorkhire-future-tram'

};

export enum ClassNames {
    /** `<ul>` where each `<li>` contains info relating to an individual route */
    ROUTES_SERVICES = 'services',
    /** Unique `<strong>` within a `<span>` within the `<li>` */
    ROUTES_NAME = 'name',
    /** Unique `<span>` within the `<li>` */
    ROUTES_DESCRIPTION = 'description',

    /** `<div>` pertaining to a direction (e.g. Malin Bridge -> Halfway) */
    STOPS_GROUPING = 'grouping',
    /** `<table>` within the grouping which has the stop data */
    STOPS_TIMETABLE = 'timetable',
    /** Class on hidden `<tr>`s in the timetable */
    STOPS_MINOR = 'minor'
}
