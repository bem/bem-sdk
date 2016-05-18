'use strict';

const test = require('ava');
const parse = require('../..').parse;

test('should parse empty legacy blocks property', t => {
    t.deepEqual(parse({ version: 'next', decl: [] }), []);
});

test('should parse blocks property with single entity', t => {
    t.deepEqual(parse({ version: 'next', decl: [{ block: 'doesnt-matter', elems: ['elem'] }] }),
        [{ block: 'doesnt-matter' }, { block: 'doesnt-matter', elem: 'elem' }]);
});
