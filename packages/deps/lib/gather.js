'use strict';

const walk = require('@bem/sdk.walk');
const fs = require('fs');

/**
 * Gathering deps.js files with bem-walk
 * @param {BemConfig} config
 * @returns {Promise<Array<BemFile>>}
 */
module.exports = function (config) {
    return new Promise((resolve, reject) => {
        const walker = walk(config.levels, { defaults: config.options });
        const res = [];
        let filesCount = 1;
        let rejected =  false;
        const resolveIfPossible = () => (--filesCount || resolve(res));

        walker
            .on('data', function (file) {
                if (rejected || file.tech !== 'deps.js') {
                    return;
                }

                filesCount++;
                fs.stat(file.path, function (err, stats) {
                    if (rejected) {
                        return;
                    }
                    if (err) {
                        rejected = true;
                        reject(err);
                        return;
                    }

                    stats.isFile() && res.push(file);

                    resolveIfPossible();
                });
            })
            .on('error', reject)
            .on('end', resolveIfPossible);
    });
};
