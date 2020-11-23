const fs = require('fs');
const glob = require('glob');

exports.exists = async function(filePath) {
    return fs.promises.access(filePath).then(() => true).catch(() => false);
};

exports.get = async function get(include, exclude, base) {
    return await new Promise((resolve, reject) => {
        glob(include, { 
            nodir: true,
            cwd: base,
            ignore: exclude 
        }, (err, files) => {
            if(err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
};