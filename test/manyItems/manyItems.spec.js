const scan = require('../../src/index');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');

const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');
const outputFile = path.join(outputDir, 'rss.xml');
const url = 'https://example.com';

describe('many items:', () => {
    beforeAll(async () => {
        await scan({
            inputDir,
            outputDir,
            url
        });
    });

    describe('rss', () => {
        let xml;

        beforeEach(async () => {
            const rssContent = await fs.promises.readFile(outputFile, 'utf8');
            const parser = new xml2js.Parser();
            xml = await parser.parseStringPromise(rssContent);
        });
        
        it('has correct number of items', async () => {
            expect(xml.rss.channel[0].item.length).toBe(3);
        });

        it('orders items by date, newest first', async () => {
            expect(xml.rss.channel[0].item[0].title[0]).toBe('Feed item 3');
            expect(xml.rss.channel[0].item[1].title[0]).toBe('Feed item 2');
            expect(xml.rss.channel[0].item[2].title[0]).toBe('Feed item 1');
        });
    });
})