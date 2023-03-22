const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const getUserInput = require('./getUserInput');

// TODO: Remove hardcoded URL
const testLink = 'https://mangakakalot.com/chapter/shiji/chapter_1';

// TODO: Replace testLink with URL provided by user in CLI
async function parseMangakalotComics(url = testLink) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        page.setExtraHTTPHeaders({
            Referer: 'https://mangakakalot.com/'
        });

        const allImgResponses = {};
        page.on('response', (response) => {
            if (response.request().resourceType() === 'image') {
                allImgResponses[response.url()] = response;
            }
        });

        // Mangakalot currently renders comic images inside div.container-chapter-reader
        await page.goto(url); //, { waitUntil: 'networkidle2' }
        await page.waitForSelector('div.container-chapter-reader', {
            timeout: 100
        });

        // This code block appears related to the "Target closed" error mentioned below.
        // Refactoring it to use page.evaluate() and Array.from appears to help fix the error.

        // let imageSrcs = await page.$$eval(
        //     'div.container-chapter-reader > img',
        //     (e) => {
        //         return e.map((img) => img.src);
        //     }
        // );

        const imageSrcs = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll('div.container-chapter-reader img'),
                ({ src }) => src
            )
        );

        // TODO: Create subfolders for manga name followed by chapter number
        // /images/manga_name/chapter_number

        // Create /images directory if it doesn't exist
        fs.mkdir(path.join(__dirname, 'images'), { recursive: true }, (err) => {
            if (err) {
                return console.error(err);
            } else {
                console.log('Directory created!');
            }
        });

        /*
        // The await keyword in the code block below gives this error:
        // "'await' expressions are only allowed within async functions and at the top levels of modules"

        // Prepending the "(src) =>" callback inside forEach with 'async' fixes the above error.
        // However, this results in a new error:
        "Protocol error (Network.getResponseBody): Target closed."
    
        imageSrcs.forEach((src) => {
            fs.writeFileSync(
                'images/' + src.replace(/^.*[\\\/]/, ''),
                await allImgResponses[src].buffer()
            );
        });
    */

        // TODO: Save images inside manga chapter subfolder
        // like this: /images/manga_name/chapter_number
        for (const src of imageSrcs) {
            fs.writeFile(
                'images/' + src.replace(/^.*[\\\/]/, ''),
                await allImgResponses[src].buffer(),
                function (err) {
                    if (err) {
                        return console.error(err);
                    } else {
                        // TODO: Replace 'File' with actual file name
                        console.log('File saved!');
                    }
                }
            );
        }

        await browser.close();
    } catch (err) {
        console.error(err);
    }
}

getUserInput()
    .then((mangaUrl) => {
        return parseMangakalotComics(mangaUrl);
    })
    .catch((err) => console.error(err))
    .finally(() => {
        console.log('Exiting Mangakalot Web scraper!');
        process.exit(0);
    });
