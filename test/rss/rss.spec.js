const scan = require('../../src/index');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');

const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');
const outputFile = path.join(outputDir, 'rss.xml');
const url = 'https://example.com';

describe('rss:', () => {
    beforeAll(async () => {
        await scan({
            inputDir,
            outputDir,
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
            
        it('has rss root element', async () => {
            expect(xml.rss).toBeDefined();
        });
         
        it('is rss version 2.0', async () => {
            expect(xml.rss.$.version).toBe('2.0');
        });
        
        it('has a single channel', async () => {
            expect(xml.rss.channel.length).toBe(1);
        });
    });
});