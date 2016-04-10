'use strict';

const test = require('ava');

const walk = require('../../../lib/index');

test.cb('should throw error if level is not found', t => {
    t.plan(2);

    const bemconfig = {
        levels: {}
    };

    walk(['not-existing-level'], bemconfig)
        .resume()
        .on('error', err => {
            t.is(err.code, 'ENOENT');
            t.is(err.path, 'not-existing-level');
            t.end();
        });
});
