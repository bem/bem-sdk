'use strict';

const assert = require('assert');
const fs = require('fs');

const Config = require('@bem/sdk.config');
const walk = require('@bem/sdk.walk');

/**
 * Gathering deps.js files with bem-walk
 * @param {BemConfig} config
 * @returns {Promise<Array<BemFile>>}
 */
module.exports = async function ({ platform = 'desktop', defaults = {}, config }) {
    config || (config = Config());

    assert(!Array.isArray(config.levels), 'Please pass config into deps/gather as field (`{config}`)');

    const [ levels, levelMap ] = await Promise.all([
        config.levels(platform),
        config.levelMap(),
    ]);

    return new Promise(async (resolve, reject) => {
        const walker = walk(levels.map(l => l.path || l), { levels: levelMap, defaults });
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
