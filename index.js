const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const getUserInput = require('./getUserInput');

async function parseMangakalotComics(url) {
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

        const imageSrcs = await page.evaluate(() =>
            Array.from(
                document.querySelectorAll('div.container-chapter-reader img'),
                ({ src }) => src
            )
        );

        const urlParts = url.split('/');
        const mangaName = urlParts[url.split('/').indexOf('chapter') + 1];
        const mangaChapter = urlParts.length - 1;

        // Create /images/manga_name/chapter_number directory if it doesn't exist
        fs.mkdir(
            path.join(__dirname, 'images', mangaName, urlParts[mangaChapter]),
            { recursive: true },
            (err) => {
                if (err) {
                    return console.error(err);
                } else {
                    console.log(
                        `Creating directory ${__dirname}/images/${mangaName}/${urlParts[mangaChapter]}/`
                    );
                }
            }
        );

        // Save images inside manga chapter subfolder
        for (const src of imageSrcs) {
            const imageFileName = src.replace(/^.*[\\\/]/, '');
            fs.writeFile(
                `images/${mangaName}/${urlParts[mangaChapter]}/${imageFileName}`,
                await allImgResponses[src].buffer(),
                function (err) {
                    if (err) {
                        return console.error(err);
                    } else {
                        console.log(
                            `Saving images/${mangaName}/${urlParts[mangaChapter]}/${imageFileName}`
                        );
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
