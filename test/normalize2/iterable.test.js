'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize2');

test('should support iterable set', t => {
    const decl = new Set();

    decl.add({
        block: 'block'
    });
    decl.add({
        block: 'block1',
        elem: 'elem'
    });

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: undefined },
        { entity: { block: 'block1', elem: 'elem' }, tech: undefined }
    ]);
});
