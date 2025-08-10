import axios from 'axios';
import { JSDOM } from 'jsdom';

enum URLs {
    /** The page that says in plain english in the HTML what the routes are */
    ROUTES_HOMEPAGE = 'https://www.travelsouthyorkshire.com/en-GB/supertram/supertram-network-and-routes'
};

async function main(): Promise<void> {
    // get the homepage
    const response = await axios.get(URLs.ROUTES_HOMEPAGE);

    // parse it as html
    const htmlString = response.data;
    const dom = new JSDOM(htmlString);
    const document = dom.window.document;
    console.log(document.body.outerHTML);
}

main();
