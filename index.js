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

        // if user runs `node index.js`
        // cwdPath is Users/USER_NAME/Documents/GitHub/mangakalot-web-scraper/images/shiji/chapter_1/
        // executablePath is /Users/USER_NAME/.nvm/versions/node/v16.15.0/bin/images/shiji/chapter_1

        // if user runs `dist/index-macos`
        // cwdPath is /snapshot/dist/images/shiji/chapter_1/        
        // executablePath is /Users/USER_NAME/Documents/GitHub/mangakalot-web-scraper/dist/images/shiji/chapter_1
        const executablePath = path.join(path.dirname(process.execPath), 'images', mangaName, urlParts[mangaChapter]);
        const cwdPath = path.join(process.cwd(), 'images', mangaName, urlParts[mangaChapter]);
        const saveFolderPath = cwdPath.includes('snapshot') ? executablePath : cwdPath;

        console.log('cwdPath', cwdPath);
        console.log('executablePath', executablePath);
        console.log('saveFolderPath', saveFolderPath);

        // console.log('process', process);
        // console.log('process.pkg', process.pkg);
        // console.log('process.cwd()', process.cwd());
        // console.log('__dirname', __dirname);
        // console.log('process.execPath', process.execPath);
        // console.log('path.dirname(process.execPath)', path.dirname(process.execPath));

        // Create /images/manga_name/chapter_number directory if it doesn't exist
        fs.mkdir(
            saveFolderPath,
            { recursive: true },
            (err) => {
                if (err) {
                    return console.error(err);
                } else {
                    console.log(
                        `Creating directory ${saveFolderPath}/`
                    );
                }
            }
        );

        // Save images inside manga chapter subfolder
        for (const src of imageSrcs) {
            const imageFileName = src.replace(/^.*[\\\/]/, '');
            fs.writeFile(
                `${saveFolderPath}/${imageFileName}`,
                await allImgResponses[src].buffer(),
                function (err) {
                    if (err) {
                        return console.error(err);
                    } else {
                        console.log(
                            `Saving images/${saveFolderPath}/${imageFileName}`
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
