'use strict';

const fs = require('fs');
const stream = require('stream');

const Benchmark = require('Benchmark');
const series = require('promise-map-series');
const stringifyEntity = require('bem-naming').stringify;

const fixtures = require('./fixtures');

const walk = require('../lib');
const enb = require('./enb');
const scanl = require('./scan-level');

const cases = [
    { name: 'flat level',     levels: fixtures.levels.flat,    scheme: 'flat' },
    { name: 'nested level',   levels: fixtures.levels.nested,  scheme: 'nested' },
    { name: 'bem-bl',         levels: fixtures.libs['bem-bl'], scheme: 'nested' },
    { name: 'bem-components', levels: fixtures.libs.o2,        scheme: 'nested' }
];

series(cases, item => {
    return new Promise(resolve => {
        const suite = new Benchmark.Suite(item.name);

        suite
            .add('                bem-walk', deferred => {
                walk(item.levels, { defaults: { scheme: item.scheme } })
                    .resume().on('end', () => deferred.resolve());
            }, { defer: true })
            .add('    bem-walk + fs.stat()', deferred => {
                const data = {};

                walk(item.levels, { defaults: { scheme: item.scheme } })
                    .pipe(new stream.Writable({
                        objectMode: true,
                        write: function (file, encoding, callback) {
                            fs.stat(file.path, (err, stats) => {
                                if (err) {
                                    return callback(err);
                                }

                                const id = stringifyEntity(file.entity);

                                file.stat = stats;
                                data[id] = file;

                                callback();
                            });
                        }
                    }))
                    .on('error', err => deferred.reject(err))
                    .on('finish', () => deferred.resolve());
            }, { defer: true })
            .add('bem-walk + fs.statSync()', deferred => {
                const data = {};

                walk(item.levels, { defaults: { scheme: item.scheme } })
                    .on('data', file => {
                        const id = stringifyEntity(file.entity);
                        const stats = fs.statSync(file.path);

                        file.stat = stats;
                        data[id] = file;
                    })
                    .resume()
                    .on('error', err => deferred.reject(err))
                    .on('end', () => deferred.resolve());
            }, { defer: true })
            .add('                     enb', deferred => {
                enb(item.levels, item.scheme, () => deferred.resolve());
            }, { defer: true })
            .add('                   scanl', deferred => {
                scanl(item.levels, item.scheme, () => deferred.resolve());
            }, { defer: true })
            .on('start', () => {
                console.log('                         ' + item.name)
            })
            .on('cycle', event => {
                const target = event.target;
                const mean = target.stats.mean * 1000;

                console.log(`${target} mean ${mean.toFixed(2)} ms`);
            })
            .on('complete', () => {
                console.log('');
                resolve();
            })
            .run();
    });
});
