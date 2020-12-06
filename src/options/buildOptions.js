const path = require('path');
const defaultOptions = require('./defaultOptions.json');
const fileUtils = require('../utils/file.js');
const log = require('../utils/log.js');

module.exports = async function buildOptions(runtimeOptions) {
    const configFile = path.join(process.cwd(), 'genrss.json');
    log(`Checking for config file: ${configFile}`);
    let userOptions = null;
    if(await fileUtils.exists(configFile)) {
        userOptions = require(configFile);
        log(`Running with user options: ${JSON.stringify(userOptions, null, 2)}`);
    } else {
        log('Running with default options');
    }

    const options = { ...defaultOptions, ...userOptions, ...runtimeOptions };

    if(options.url == null) {
        throw new Error('Url must be specified. Please ensure that you have set the url property in your genrss.json configuration file');
    }

    if((options.title == null) || (options.description == null)) {
        const packageFile = path.join(process.cwd(), 'package.json');
        log(`Checking package file for additional settings: ${packageFile}`);
        if(await fileUtils.exists(packageFile)) {
            const package = require(packageFile);
            if(options.title == null) {
                options.title = package.name;
                log(`Using package name: ${package.name}`);
            }

            if(options.description == null) {
                options.description = package.description;
                log(`Using package description: ${package.description}`);
            }
        } else {
            log('Package file not found');
        }
    }

    return options;
}