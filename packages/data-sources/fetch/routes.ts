import puppeteer from 'puppeteer';

enum URLs {
    PREFIX = 'https://www.travelsouthyorkshire.com/en-GB/supertram',
    /** The page that says in plain english in the HTML what the routes are */
    ROUTES_HOMEPAGE = URLs.PREFIX + '/supertram-network-and-routes'
};

enum Headers {
    USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0'
}

async function main(): Promise<void> {
    // create browser and page
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // go to the routes homepage.
    // this page has the info, but the HTML is not structured in a way that makes it easy
    // to scrape. it doesn't have classnames that delineate the different parts of the
    // page for example. so we just have to do stuff like notice patterns in hrefs and
    // search for those and then find elements relative to those to get the
    // human-readable text
    await page.goto(URLs.ROUTES_HOMEPAGE);

    // find the anchor tags that have hrefs that end in '/supertram/<route-name>-route'
    // as these are the links to the routes' pages
    const routeLinks = await page.$$eval('a[href*="/supertram/"][href$="-route"]', (anchors) => {
        const allHrefs = anchors.map(a => (a as HTMLAnchorElement).href);
        const uniqueHrefs = new Set(allHrefs);
        return uniqueHrefs;
    });
    console.log(routeLinks);

    await browser.close();
}

main();
