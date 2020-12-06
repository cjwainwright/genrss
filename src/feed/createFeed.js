const xml = require('xml');
const fs = require('fs');
const path = require('path');
const log = require('../utils/log.js');

module.exports = async function createFeed(options, items) {
    log('Creating feed xml');

    // order so newest are first
    const sortedItems = items.filter(item => item.date != null);
    sortedItems.sort((a, b) => b.date - a.date);

    // truncate to item count
    if(sortedItems.length > options.itemCount) {
        log(`Truncating to latest ${options.itemCount}`);
        sortedItems.length = options.itemCount;
    } 

    // build feed xml
    const feedDataXmlObj = [
        { title: options.title },
        { link: options.url },
        { description: options.description }
    ];

    const itemsXmlObj = sortedItems.map(function (item) {
        return {
            item: [
                { title: item.title },
                { pubDate: item.date.toUTCString() },
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

    const rss = xml(feedXmlObj, { declaration: true });

    const output = path.join(options.outputDir, options.outputFile);
    log(`Writing feed xml to ${output}`);
    await fs.promises.mkdir(path.dirname(output), { recursive: true });
    await fs.promises.writeFile(output, rss, 'utf8');
};

