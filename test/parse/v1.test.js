'use strict';

const test = require('ava');
const parse = require('../..').parse;

test('should parse empty legacy blocks property', t => {
    t.deepEqual(parse({ version: '1.0', decl: [] }), []);
});

test('should parse blocks property with single entity', t => {
    t.deepEqual(parse({ version: '1.0', decl: [{ name: 'doesnt-matter' }] }),
        [{ block: 'doesnt-matter' }]);
});
