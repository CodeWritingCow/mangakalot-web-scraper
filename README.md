# mangakalot-web-scraper
A Node.js command-line application for downloading manga images from Mangakalot.com.

## Author
**Gary Pang** - [garypang.dev](https://garypang.dev)

## Requirements

#### Getting Started
- Run `node index.js` in terminal
  - (Mac users only) As an alternative, run the application as an [executable](https://github.com/CodeWritingCow/mangakalot-web-scraper/releases/download/v1.0.0/index-macos).
- When prompted, enter URL of a manga's chapter to download. The URL should follow this format: https://mangakakalot.com/chapter/MANGA_NAME/CHAPTER_NUMBER (For example, 'https://mangakakalot.com/chapter/shiji/chapter_6).

#### Key Dependencies
- [Node.js](https://nodejs.org/en) This application was tested at v16.5
- [Puppeteer](https://pptr.dev/) Node.js library for running Chrome/Chromium in headless mode
