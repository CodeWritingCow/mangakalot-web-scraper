// File for experimenting how to save a single image

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const testImgSrc =
    'https://v2.mkklcdnv6tempv2.com/img/tab_2/02/47/16/yq976073/vol_1_chapter_1_road_to_hegemony_sima_qian/2-o.jpg';
// 'https://v2.mkklcdnv6tempv2.com/img/tab_2/02/47/16/yq976073/vol_1_chapter_1_road_to_hegemony_sima_qian/1-o.jpg';

async function saveTestImgSrc(url = testImgSrc) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.setExtraHTTPHeaders({
        Referer: 'https://mangakakalot.com/'
    });

    const imagefileDL = await page.goto(url, { waitUntil: 'networkidle2' });

    // Create /images directory if it doesn't exist
    fs.mkdir(path.join(__dirname, 'images'), { recursive: true }, (err) => {
        if (err) {
            return console.error(err);
        } else {
            console.log('Directory created!');
        }
    });

    // Save file to /images
    fs.writeFile(
        'images/' + url.replace(/^.*[\\\/]/, ''),
        await imagefileDL.buffer(),
        function (err) {
            if (err) {
                return console.error(err);
            } else {
                console.log('File saved!');
            }
        }
    );
    await browser.close();
}

saveTestImgSrc();
