const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// TODO: Remove hardcoded URL
const testLink = 'https://mangakakalot.com/chapter/shiji/chapter_1';

// TODO: Replace testLink with URL provided by user in CLI
async function parseMangakalotComics(url = testLink) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Mangakalot currently renders comic images inside div.container-chapter-reader
    await page.goto(url, { waitUntil: 'networkidle2' });
    await page.waitForSelector('div.container-chapter-reader', {
        timeout: 100
    });

    let imageSrcs = await page.$$eval(
        '.container-chapter-reader > img',
        (e) => {
            return e.map((img) => img.src);
        }
    );

    // TODO: Save each image as jpg file
    imageSrcs.forEach(async (src) => {
        page.setExtraHTTPHeaders({
            'user-agent':
                'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36',
            'upgrade-insecure-requests': '1',
            accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'accept-encoding': 'gzip, deflate, br',
            'accept-language': 'en-US,en;q=0.9,en;q=0.8',
            Referer: 'https://mangakakalot.com/'
        });
        await page.waitForTimeout((Math.floor(Math.random() * 12) + 5) * 1000);

        const imagefileDL = await page.goto(src);
        fs.writeFile(
            './imgs/' + src.replace(/^.*[\\\/]/, ''),
            await imagefileDL.buffer(),
            function (err) {
                if (err) {
                    return console.error(err);
                } else {
                    console.log('File saved');
                }
            }
        );
        // console.log(src);
    });

    await browser.close();
}

parseMangakalotComics();
