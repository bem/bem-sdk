'use strict';

const path = require('path');
const test = require('ava');

const walk = require('../../../lib/index');

test.cb('should throw error if level is not found', t => {
    t.plan(2);

    const levelpath = path.resolve('./not-existing-level');
    const options = {
        defaults: { scheme: 'flat' }
    };

    walk([levelpath], options)
        .resume()
        .on('error', err => {
            t.is(err.code, 'ENOENT');
            t.is(err.path, levelpath);
            t.end();
        });
});
