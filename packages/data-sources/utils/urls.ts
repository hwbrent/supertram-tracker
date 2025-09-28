/**
 * @summary A file containing enums containing URLs pertaining to each other module
 * in the codebase
 * @module classNames
 */

/** @see {@link module:routes} */
export enum Routes {
    /** The base URL of the site */
    BASE = "https://bustimes.org",
    /**
     * The page that has hrefs to the routes
     *
     * (Yes the actual URL has a spelling error "yorkhire")
     */
    HOMEPAGE = Routes.BASE + '/operators/south-yorkhire-future-tram'
};
