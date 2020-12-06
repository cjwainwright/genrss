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

describe('no items:', () => {
    beforeAll(async () => {
        await scan({
            inputDir,
            outputDir,
            title,
            description,
            url
        });
    });

    it('creates the output rss document', async () => {
        let stats = await fs.promises.stat(outputFile);
        expect(stats.isFile()).toBe(true);
    });

    describe('rss', () => {
        let xml;

        beforeEach(async () => {
            const rssContent = await fs.promises.readFile(outputFile, 'utf8');
            const parser = new xml2js.Parser();
            xml = await parser.parseStringPromise(rssContent);
        });

        it('has no items', async () => {
            expect(xml.rss.channel[0].item).not.toBeDefined();
        });
    });

})