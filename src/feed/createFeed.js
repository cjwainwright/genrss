const xml = require('xml');
const fs = require('fs');
const path = require('path');
const log = require('../utils/log.js');

module.exports = async function createFeed(options, items) {
    log('Creating feed xml');

    const feedDataXmlObj = [
        { title: options.title },
        { link: options.url },
        { description: options.description }
    ];

    const itemsXmlObj = items.map(function (item) {
        return {
            item: [
                { title: item.title },
                { pubDate: item.date },
                { link : item.url },
                { description: item.content }
            ]
        };
    });

    const feedXmlObj = { 
        rss: [ 
            { 
                _attr: { version: '2.0'}
            },
            {
                channel: feedDataXmlObj.concat(itemsXmlObj)
            }
        ]
    };

    const rss = xml(feedXmlObj);

    const output = path.join(options.outputDir, options.outputFile);
    log(`Writing feed xml to ${output}`)
    await fs.promises.writeFile(output, rss, 'utf8');
};

