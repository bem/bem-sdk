'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize2');

test('should support shortcut for bool mod of elem', t => {
    const decl = { block: 'block', elems: 'elem', mod: 'mod' };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem' }, tech: null }
    ]);
});
test('should support bool mod of elems', t => {
    const decl = { block: 'block', elems: 'elem', mod: 'mod', val: true };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem' }, tech: null }
    ]);
});
test('should remove bool mod on elem if falsy except 0', t => {
    const decl  = [
        { block: 'block', elems: 'elem', mod: 'mod', val: false },
        { block: 'block', elems: 'elem', mod: 'mod', val: undefined },
        { block: 'block', elems: 'elem', mod: 'mod', val: null }
    ];

    const expected = [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem' }, tech: null }
    ]

    decl.forEach(item => {
        t.deepEqual(normalize(item), expected);
    });
});
