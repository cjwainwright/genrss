const scan = require('../../src/index');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');

const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');
const outputFile = path.join(outputDir, 'rss.xml');
const url = 'https://example.com';

describe('many files:', () => {
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
    });
})