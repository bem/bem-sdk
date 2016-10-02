'use strict';

const test = require('ava');

const convert = require('../../lib/convert');

test('should throw exception if no format given', t => {
    t.throws(() => convert({ entity: { block: 'block' }, tech: null }), 'You must declare target format');
});

test('should convert to enb format', t => {
    t.deepEqual(convert({ entity: { block: 'block' }, tech: null }, { format: 'enb' }), [{ block: 'block' }]);
});

test('should convert with elem', t => {
    t.deepEqual(
        convert([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null }
        ], { format: 'enb' }),
        [
            { block: 'block' },
            { block: 'block', elem: 'elem' }
        ]
    );
});

test('should convert with mod', t => {
    t.deepEqual(
        convert([
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null }
        ], { format: 'enb' }),
        [{ block: 'block', mod: 'mod', val: 'val' }]
    )
});
