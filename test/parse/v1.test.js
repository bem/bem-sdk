'use strict';

const test = require('ava');
const parse = require('../..').parse;

test('should parse empty legacy blocks property', t => {
    t.deepEqual(parse('({ version: \'v1\', blocks: [] })'), []);
});

test('should parse blocks property with single entity', t => {
    t.deepEqual(parse('({ version: \'v1\', blocks: [{ name: \'doesnt-matter\' }] })'),
        [{ entity: { block: 'doesnt-matter' }, tech: null }]);
});

test('should parse empty legacy blocks property of object', t => {
    t.deepEqual(parse({ version: 'v1', blocks: [] }), []);
});

test('should parse blocks property with single entity of object', t => {
    t.deepEqual(parse({ version: 'v1', blocks: [{ name: 'doesnt-matter' }] }),
        [{ entity: { block: 'doesnt-matter' }, tech: null }]);
});
