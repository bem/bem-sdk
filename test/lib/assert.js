'use strict';

const walk = require('../../lib/index');

function assert(levels, config, expected) {
    const buffer = [];
    const walker = walk(levels, config);

    let hasError = false;

    return new Promise((resolve, reject) => {
        walker.on('data', obj => {
            buffer.push(obj);
        });

        walker.on('end', () => {
            if (!hasError) {
                try {
                    buffer.must.eql(expected);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }
        });

        walker.on('error', err => {
            hasError = true;
            reject(err);
        });
    });
}

module.exports = assert;
