# packages/data-sources

Pulls from timetables, APIs, or crowdsourced GPS

## Data needed

| **Data Type**      | **Why You Need It**                |
| ------------------ | ---------------------------------- |
| Tram stop list     | For map display, route matching    |
| Timetables         | For route simulation + predictions |
| Live ETAs (if any) | For real-time movement inference   |
| Route paths        | For snapping GPS to tracks         |

## Potential sources

- https://www.travelsouthyorkshire.com/en-gb/supertram/home
    - Picks up on programmatic GET requests and blocks them
- https://developer.transportapi.com/
