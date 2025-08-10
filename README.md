# supertram-tracker

## Background

The idea is to build an app that works similarly to [Signalbox](https://www.signalbox.io/), but for Sheffield's [Supertram](https://www.travelsouthyorkshire.com/en-GB/supertram/home) network.

Unfortunately, currently there is no publicly-available live tram GPS data. The most info that anyone has is just when trams are expected to be at each stop, which is often incorrect.

The idea is to create an app that can intelligently predict where trams *should* be and display that data to users in order to make it easier to use the tram system.

## Technical considerations

### Signalbox’s Method (Simplified)

Signalbox tracks trains using:
- Smartphone GPS (from the user — not the vehicle)
- Time + route prediction models
- Movement inference from network data (like berth or signal transitions)

You can do a similar thing for trams, just using:
- GPS from the user's device
- Live ETAs or scheduled timetables from the tram operator (if available)
- Stop-based data to infer tram movement

### What You’ll Need to Pull It Off
1. Scheduled Timetable or Departure Info
    - Get the tram schedule, including stops and timings.
        - ✅ You can likely scrape or pull from Travel South Yorkshire or via Transdev's APIs (if they exist).
    - Stop-by-stop predictions may be available via their app or NextBuses API (though mostly for buses).

2. Stop Location Data (GTFS)
    - You’ll need lat/lng for every stop.
    - If Supertram or SYMCA don’t publish a GTFS (General Transit Feed Specification) dataset, you may need to build one manually.

3. User GPS Matching
    - Collect GPS samples from the user’s phone.
    - Snap these locations to the tram route/stops using a spatial matching algorithm.
    - Infer direction and tram route based on timing and movement.

4. Predict Other Trams’ Positions
    - With enough user data, you can:
        - Track which tram a user is on
        - Estimate that tram’s position as it moves
        - Use this to model or simulate the current state of the network (just like Signalbox)

### Challenges
| Challenge             | Details                                                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| 🔒 No public tram GPS | Unlike trains, tram networks like Supertram don't expose signal or movement data — and probably never will    |
| 📱 User density       | You'll need enough active users contributing location data to reliably detect tram movements                  |
| 📡 Real-time accuracy | Without operator data (AVLS), your model will need to work around signal delays, turnbacks, disruptions, etc. |
| 🧮 Complex inference  | You'll need to model tram behavior, average speeds, dwell times, etc., based on user movement patterns        |

### Optional Enhancements
- Background location tracking (with permission) to detect tram journeys passively
- Geofencing to identify tram stops/zones
- Crowdsourced status (e.g., "this tram is delayed", "tram left stop early", etc.)

### Summary
| Component              | Feasible? | Notes                          |
| ---------------------- | --------- | ------------------------------ |
| GPS from users         | ✅ Yes     | Easy with smartphone sensors   |
| Tram timetables        | ✅ Likely  | Public or scrapeable           |
| Live departure data    | ⚠️ Maybe  | Might exist for some stops     |
| Raw tram GPS           | ❌ No      | Not publicly available         |
| Real-time inference    | ✅ Yes     | With good GPS + model          |
| Multi-user correlation | ✅ Yes     | Crowdsourced approach possible |
