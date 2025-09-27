import puppeteer from 'puppeteer';

enum URLs {
    /**
     * The page that has hrefs to the routes
     *
     * (Yes the actual URL has a spelling error "yorkhire")
     */
    ROUTES_HOMEPAGE = 'https://bustimes.org/operators/south-yorkhire-future-tram'
};

export default async function main(): Promise<void> {
    // create browser and page
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // go to the routes homepage
    await page.goto(URLs.ROUTES_HOMEPAGE, { waitUntil: 'networkidle2' });

    // Run DOM code in the browser context
    const results = await page.evaluate(() => {
        // There's a <ul> containing the routes called "services"
        const [services] = document.getElementsByClassName('services');

        // Within the <ul> is a list of items, where each item is a route
        const lis = Array.from(services?.children || []);
        return lis.map((li) => {
            // Each route has an anchor tag, within which there's obviously an href, but
            // also the name and description of the route
            const [anchor] = li.getElementsByTagName('a');
            const href = anchor?.href || '';
            const name = li.getElementsByClassName('name')[0]?.textContent?.trim()|| '';
            const description = li.getElementsByClassName('description')[0]?.textContent?.trim() || '';
            return { href, name, description };
        });
    });

    // Print results
    results.forEach(({ href, name, description }) => {
        console.log(href, name, description);
    });

    await browser.close();
}

main();
