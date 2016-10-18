'use strict';

const test = require('ava');

const parse = require('../../lib/parse');

test('should throw error while parsing empty deps property if format not given', t => {
    t.deepEqual(parse('({ deps: [] })'), []);
});

test('should parse blocks property with single entity', t => {
    t.deepEqual(parse('({ format: \'enb\', deps: [{ block: \'doesnt-matter\', elems: [\'elem\'] }] })'),
        [{ entity: { block: 'doesnt-matter' }, tech: null },
         { entity: { block: 'doesnt-matter', elem: 'elem' }, tech: null }]);
});

test('should parse empty legacy blocks property of object', t => {
    t.deepEqual(parse({ format: 'enb', deps: [] }), []);
});

test('should parse blocks property with single entity of object', t => {
    t.deepEqual(parse({ format: 'enb', deps: [{ block: 'doesnt-matter', elems: ['elem'] }] }),
        [{ entity: { block: 'doesnt-matter' }, tech: null },
         { entity: { block: 'doesnt-matter', elem: 'elem' }, tech: null }]);
});
