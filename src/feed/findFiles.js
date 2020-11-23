const log = require('../utils/log.js');
const fileUtils = require('../utils/file.js');

module.exports = async function findFiles(options) {
    log(`Searching for files in ${options.inputDir}`);
    let files = [];
    for(let include of options.inputFiles) {
        log(`Searching for files matching ${include}`);
        let temp = await fileUtils.get(include, [], options.inputDir);
        files = files.concat(temp);
    }
    log(`Found ${files.length} files for processing`);

    return files;
}