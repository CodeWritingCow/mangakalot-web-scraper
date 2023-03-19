const puppeteer = require('puppeteer');

// TODO: Remove hardcoded URL
const testLink = 'https://mangakakalot.com/chapter/shiji/chapter_1';
// console.log('Hello world!');

// TODO: Replace testLink with URL provided by user in CLI
async function parseMangakalotComics(url = testLink) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Mangakalot currently renders comic images inside div.container-chapter-reader
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('div.container-chapter-reader', { timeout: 100 });

    let imageSrcs = await page.$$eval('.container-chapter-reader > img', (e) => {
        return e.map((img) => img.src);
    });

    // TODO: Save each image as jpg file
    imageSrcs.forEach((image) => {
        console.log(image);
    });

    await browser.close();
}

parseMangakalotComics();
