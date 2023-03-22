const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const ask = (query) => {
    return new Promise((resolve) => {
        rl.question(query, (userInput) => {
            resolve(userInput);
        });
    });
};

const getUserInput = async () => {
    console.log('Welcome to Mangakalot Web scraper!');
    console.log('Enter URL of of manga chapter to download');
    console.log('(ex. https://mangakakalot.com/chapter/shiji/chapter_6)\n');

    const mangaUrl = await ask('Enter URL: ');
    // TODO: Add logic for validating mangaUrl as a Mangakalot URL 

    rl.close;
    return mangaUrl;
};

rl.on('close', () => {
    console.log('Exiting Mangakalot Web scraper!');
    process.exit(0);
});

module.exports = getUserInput;
