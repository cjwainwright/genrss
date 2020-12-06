
const log = require('./utils/log.js');
const buildOptions = require('./options/buildOptions.js');
const findFiles = require('./feed/findFiles.js');
const processFiles = require('./feed/processFiles.js');
const createFeed = require('./feed/createFeed.js');

module.exports = async function scan(runtimeOptions) {
    log('Beginning scan')
    const options = await buildOptions(runtimeOptions);
    const files = await findFiles(options);
    const items = await processFiles(files, options);
    await createFeed(options, items);
    log(`Done.`);
}