'use strict';

const test = require('ava');
const parse = require('../..').parse;

test('should parse empty legacy blocks property', t => {
    t.deepEqual(parse({ blocks: [] }), []);
});

test('should parse blocks property with single entity', t => {
    t.deepEqual(parse({ blocks: [{ name: 'doesnt-matter' }] }),
        [{ entity: { block: 'doesnt-matter' }, tech: undefined }]);
});
