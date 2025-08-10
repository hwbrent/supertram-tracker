import axios from 'axios';
import { JSDOM } from 'jsdom';

enum URLs {
    PREFIX = 'https://www.travelsouthyorkshire.com/en-GB/supertram',
    /** The page that says in plain english in the HTML what the routes are */
    ROUTES_HOMEPAGE = URLs.PREFIX + '/supertram-network-and-routes'
};

enum Headers {
    USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0'
}

async function main(): Promise<void> {
    // get the homepage
    const response = await axios.get(URLs.ROUTES_HOMEPAGE, {
        headers: {
            'User-Agent': Headers.USER_AGENT
        }
    });

    // parse it as html
    const htmlString = response.data;
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;

    // this page has the info, but the HTML is not structured in a way that makes it easy
    // to scrape. it doesn't have classnames that delineate the different parts of the
    // page for example. so we just have to do stuff like notice patterns in hrefs and
    // search for those and then find elements relative to those to get the
    // human-readable text

    // find the anchor tags which link to a route's specific page
    const anchors = document.querySelectorAll('a[href*="/supertram/"][href$="-route"]');
    console.log(anchors.length);
}

main();
