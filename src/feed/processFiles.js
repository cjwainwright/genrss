const fs = require('fs');
const path = require('path');
const log = require('../utils/log.js');
const JSDOM = require('jsdom').JSDOM;

module.exports = async function processFiles(files, options) {
    const items = [];
    await Promise.all(files.map(file => processFile(file, options, items)));
    return items;
}

async function processFile(file, options, items) {
    log(`Processing file: ${file}`);

    const fileUrl = getFileUrl(file, options);
    log(`Loading html as if from url: ${fileUrl}`);

    const html = await fs.promises.readFile(path.join(options.inputDir, file), 'utf8'); // TODO - file encoding option
    const dom = new JSDOM(html, {
        url: fileUrl
    });
    const doc = dom.window.document;

    doc.querySelectorAll('[data-feed-id]').forEach(element => {
        const item = processFeedElement(element, fileUrl);
        items.push(item);
    });
}

function processFeedElement(element, fileUrl) {
    const id = element.getAttribute('data-feed-id');
    log(`Processing element with id: ${id}`);

    let title = element.getAttribute('data-feed-title');
    if(title) {
        log(`Using title: ${title}`);
    } else {
        log(`No title specified`);
    }

    let date = null;
    const dateString = element.getAttribute('data-feed-date');
    const ticks = Date.parse(dateString)
    if(isNaN(ticks)) {
        log(`Invalid date format: ${dateString}`);
    } else {
        date = new Date(ticks);
        log(`Using date: ${date.toISOString()}`);
    }

    let url = element.getAttribute('data-feed-url');
    if(url) {
        log(`Using url from element: ${url}`)
    } else {
        log(`Using url from file: ${fileUrl}`)
        url = fileUrl;
    }

    //  make all links absolute
    element.querySelectorAll('[href]').forEach(link => {
        log(`Making href absolute: ${link.getAttribute('href')} => ${link.href}`)
        link.setAttribute('href', link.href);
    });

    element.querySelectorAll('[src]').forEach(resource => {
        log(`Making src absolute: ${resource.getAttribute('src')} => ${resource.src}`)
        resource.setAttribute('src', resource.src);
    });

    return {
        id,
        title,
        date,
        url,
        content: element.outerHTML
    };
}

function getFileUrl(file, options) {
    const segments = file.split(path.delimeter);
    const relativeUrl = segments.join('/');
    const url = options.url.trimEnd('/') + '/' + relativeUrl;
    return url;
}