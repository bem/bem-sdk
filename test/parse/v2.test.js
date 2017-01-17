'use strict';

const test = require('ava');
const simplifyCell = require('../util').simplifyCell;
const parse = require('../..').parse;

test('should parse empty legacy blocks property', t => {
    t.deepEqual(parse('({ format: \'v2\', decl: [] })'), []);
});

test('should parse blocks property with single entity', t => {
    t.deepEqual(parse('({ format: \'v2\', decl: [{ block: \'doesnt-matter\', elems: [\'elem\'] }] })')
            .map(simplifyCell),
        [{ entity: { block: 'doesnt-matter' }, tech: null },
         { entity: { block: 'doesnt-matter', elem: 'elem' }, tech: null }]);
});

test('should parse empty legacy blocks property of object', t => {
    t.deepEqual(parse({ format: 'v2', decl: [] }), []);
});

test('should parse blocks property with single entity of object', t => {
    t.deepEqual(parse({ format: 'v2', decl: [{ block: 'doesnt-matter', elems: ['elem'] }] })
            .map(simplifyCell),
        [{ entity: { block: 'doesnt-matter' }, tech: null },
         { entity: { block: 'doesnt-matter', elem: 'elem' }, tech: null }]);
});
