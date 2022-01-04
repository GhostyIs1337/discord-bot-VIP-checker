const axios = require("axios").default;
const cheerio = require("cheerio");
const pretty = require("pretty");

const url = "https://moose.gg/vip/?_fromLogin=1"

let config = {
    headers: {
        "Host": "moose.gg",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en,sl;q=0.7,en-GB;q=0.3",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": "https://steamcommunity.com/",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "cross-site",
        "Sec-Fetch-User": "?1",
        "Connection": "keep-alive"
    }
}

async function scrapeData() {
    try {
        // Fetch HTML of the page we want to scrape
        const { data } = await axios.get(url, config);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);
        // Select all the list items in plainlist class
        const listItems = $(".ipsField_fieldList ul li");
        // Stores data for all countries
        const countries = [];
        // Use .each method to loop through the li we selected
        listItems.each((idx, el) => {
            // Object holding data for each country/jurisdiction
            const country = { name: "", iso3: "" };
            // Select the text content of a and span elements
            // Store the textcontent in the above object
            country.name = $(el).children("a").text();
            country.iso3 = $(el).children("span").text();
            // Populate countries array with country data
            countries.push(country);
        });
        // Logs countries array to the console
        console.dir(countries);
        // Write countries array in countries.json file
        console.log(JSON.stringify(countries, null, 2), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Successfully written data to file");
        });
    } catch (err) {
        console.error(err);
    }
}
// Invoke the above function
scrapeData();