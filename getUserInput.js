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
    printIntroMessage();

    const mangaUrl = await ask('Enter URL: ');

    return checkUserInput(mangaUrl);
};

const checkUserInput = async (url) => {
    if (url.includes(`https://mangakakalot.com`)) {
        rl.close;
        return url;
    } else if (url === 'q') {
        quitProgram();
    } else {
        console.log('\n');
        console.log('URL is invalid!');

        const mangaUrl = await ask('Please enter a valid Mangakalot URL: ');

        return checkUserInput(mangaUrl);
    }
};

function printIntroMessage() {
    console.log('\n');
    console.log('Welcome to Mangakalot Web scraper!');
    console.log('\n');
    console.log('Enter URL of of manga chapter to download');
    console.log('(ex. https://mangakakalot.com/chapter/shiji/chapter_6)\n');
    console.log(`(To quit, enter 'q' or press ctrl + c)`);
    console.log('\n');
}

function quitProgram() {
    console.log('\n');
    console.log('Exiting Mangakalot Web scraper!');
    console.log('\n');
    process.exit(0);
}

rl.on('close', () => {
    quitProgram();
});

module.exports = getUserInput;
