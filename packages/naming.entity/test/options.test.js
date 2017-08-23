'use strict';

const test = require('ava');
const naming = require('../index');

test('should throw error if specified preset is unknow', t => {
    t.throws(
        function () {
            return naming('my-preset');
        },
        'The `my-preset` naming is unknown.'
    );
});

test('should provide elem option', t => {
    const myNaming = naming({ delims: { elem: '==' } });

    t.is(myNaming.delims.elem, '==');
});

test('should support mod option as string', t => {
    const myNaming = naming({ delims: { mod: '--' } });

    t.is(myNaming.delims.mod.name, '--');
    t.is(myNaming.delims.mod.val, '--');
});

test('should support mod option as object', t => {
    const myNaming = naming({ delims: { mod: { name: '--', val: '_' } } });

    t.is(myNaming.delims.mod.name, '--');
    t.is(myNaming.delims.mod.val, '_');
});

test('should use default value if mod.val is not specified', t => {
    const myNaming = naming({ delims: { mod: { name: '--' } } });

    t.is(myNaming.delims.mod.name, '--');
    t.is(myNaming.delims.mod.val, naming.delims.mod.val);
});
