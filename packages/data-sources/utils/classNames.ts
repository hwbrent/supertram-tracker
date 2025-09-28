export enum Routes {
    /** `<ul>` where each `<li>` contains info relating to an individual route */
    SERVICES = 'services',
    /** Unique `<strong>` within a `<span>` within the `<li>` */
    NAME = 'name',
    /** Unique `<span>` within the `<li>` */
    DESCRIPTION = 'description',
};

export enum Stops {
    /** `<div>` pertaining to a direction (e.g. Malin Bridge -> Halfway) */
    GROUPING = 'grouping',
    /** `<table>` within the grouping which has the stop data */
    TIMETABLE = 'timetable',
    /** Class on hidden `<tr>`s in the timetable */
    MINOR = 'minor'
};
