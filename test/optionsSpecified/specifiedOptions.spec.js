const scan = require('../../src/index');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');

const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');
const outputFile = path.join(outputDir, 'rss.xml');
const title = 'Feed Title';
const description = 'Feed Description';
const url = 'https://example.com';
const itemCount = 2;

describe('specified options:', () => {
    beforeAll(async () => {
        await scan({
            inputDir,
            outputDir,
            title,
            description,
            url,
            itemCount
        });
    });

    describe('rss', () => {
        let xml;

        beforeEach(async () => {
            const rssContent = await fs.promises.readFile(outputFile, 'utf8');
            const parser = new xml2js.Parser();
            xml = await parser.parseStringPromise(rssContent);
        });

        it('has the specified title', async () => {
            expect(xml.rss.channel[0].title[0]).toBe(title);
        });

        it('has the specified description', async () => {
            expect(xml.rss.channel[0].description[0]).toBe(description);
        });

        it('has the correct link', async () => {
            expect(xml.rss.channel[0].link[0]).toBe(url);
        });
        
        it('has the correct number of items', async () => {
            expect(xml.rss.channel[0].item.length).toBe(itemCount);
        });
    });
});