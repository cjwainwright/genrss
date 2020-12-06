const scan = require('../../src/index');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');

const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');
const outputFile = path.join(outputDir, 'rss.xml');
const url = 'https://example.com';

describe('default options:', () => {
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

        it('has the package name as title', async () => {
            expect(xml.rss.channel[0].title[0]).toBe('genrss');
        });

        it('has the package description', async () => {
            expect(xml.rss.channel[0].description[0]).toBe('Generate RSS feeds for static sites');
        });

        it('has the correct link', async () => {
            expect(xml.rss.channel[0].link[0]).toBe(url);
        });
    });
});