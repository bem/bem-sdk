'use strict';

const test = require('ava');
const naming = require('../index');

test('should provide elem option', t => {
    const myNaming = naming({ elem: '==' });

    t.is(myNaming.elemDelim, '==');
});

test('should support mod option as string', t => {
    const myNaming = naming({ mod: '--' });

    t.is(myNaming.modDelim, '--');
    t.is(myNaming.modValDelim, '--');
});

test('should support mod option as object', t => {
    const myNaming = naming({ mod: { name: '--', val: '_' } });

    t.is(myNaming.modDelim, '--');
    t.is(myNaming.modValDelim, '_');
});

test('should use modDelim if mod.val is not specified', t => {
    const myNaming = naming({ mod: { name: '--' } });

    t.is(myNaming.modDelim, '--');
    t.is(myNaming.modValDelim, '--');
});
