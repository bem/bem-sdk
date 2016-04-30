'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize-harmony');

test('should support mix', t => {
    const decl = {
        block: 'block',
        elems: ['elem-1', 'elem-2'],
        mods: ['mod-1', 'mod-2']
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', elem: 'elem-1' },
        { block: 'block', elem: 'elem-2' },
        { block: 'block', modName: 'mod-1', modVal: true },
        { block: 'block', modName: 'mod-2', modVal: true }
    ]);
});
