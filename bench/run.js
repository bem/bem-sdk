'use strict';

const Benchmark = require('Benchmark');
const series = require('promise-map-series');

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
            .add('bem-walk', deferred => {
                walk(item.levels, { defaults: { scheme: item.scheme } })
                    .resume().on('end', () => deferred.resolve());
            }, { defer: true })
            .add('     enb', deferred => {
                enb(item.levels, item.scheme, () => deferred.resolve());
            }, { defer: true })
            .add('   scanl', deferred => {
                scanl(item.levels, item.scheme, () => deferred.resolve());
            }, { defer: true })
            .on('start', () => {
                console.log('         ' + item.name)
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
