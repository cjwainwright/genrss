const scan = require('../../src/index');
const path = require('path');
const fs = require('fs');
const xml2js = require('xml2js');

const inputDir = path.join(__dirname, 'input');
const outputDir = path.join(__dirname, 'output');
const outputFile = path.join(outputDir, 'rss.xml');
const url = 'https://example.com';

describe('one item:', () => {
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
        
        it('has one item', async () => {
            expect(xml.rss.channel[0].item.length).toBe(1);
        });

        describe('item', () => {
            let item;

            beforeEach(() => {
                item = xml.rss.channel[0].item[0];
            });

            it('has correct title', () => {
                expect(item.title[0]).toEqual('Feed item title');
            });

            it('has correct pubDate', () => {
                expect(item.pubDate[0]).toEqual(new Date(Date.parse('2020-01-01')).toUTCString());
            });

            it('has correct link', () => {
                expect(item.link[0]).toEqual(url + '/index.html');
            });

            it('has correct description', () => {
                expect(item.description[0]).toContain('<p data-feed-id="1" data-feed-date="2020-01-01" data-feed-title="Feed item title">');
                expect(item.description[0]).toContain('Here\'s some html for the feed');
                expect(item.description[0]).toContain('</p>');
            });
        });
    });

})