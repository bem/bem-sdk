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
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem-1' }, tech: null },
        { entity: { block: 'block', elem: 'elem-2' }, tech: null },
        { entity: { block: 'block', modName: 'mod-1', modVal: true }, tech: null },
        { entity: { block: 'block', modName: 'mod-2', modVal: true }, tech: null }
    ]);
});
