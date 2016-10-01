'use strict';

const test = require('ava');
const parse = require('../..').parse;

test('should parse empty legacy blocks property', t => {
    t.deepEqual(parse({ version: 'next', decl: [] }), []);
});

test('should parse blocks property with single entity', t => {
    t.deepEqual(parse({ version: 'next', decl: [{ block: 'doesnt-matter', elems: ['elem'] }] }),
        [{ entity: { block: 'doesnt-matter' }, tech: null },
         { entity: { block: 'doesnt-matter', elem: 'elem' }, tech: null }]);
});
