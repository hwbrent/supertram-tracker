import axios from 'axios';

enum URLs {
    /** The page that says in plain english in the HTML what the routes are */
    ROUTES_HOMEPAGE = 'https://www.travelsouthyorkshire.com/en-GB/supertram/supertram-network-and-routes'
};

async function main(): Promise<void> {
    // get the homepage
    const response = await axios.get(URLs.ROUTES_HOMEPAGE);
    console.log(response);
}

main();
