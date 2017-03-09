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

    t.is(myNaming.elemDelim, '==');
});

test('should support mod option as string', t => {
    const myNaming = naming({ delims: { mod: '--' } });

    t.is(myNaming.modDelim, '--');
    t.is(myNaming.modValDelim, '--');
});

test('should support mod option as object', t => {
    const myNaming = naming({ delims: { mod: { name: '--', val: '_' } } });

    t.is(myNaming.modDelim, '--');
    t.is(myNaming.modValDelim, '_');
});

test('should use default value if mod.val is not specified', t => {
    const myNaming = naming({ delims: { mod: { name: '--' } } });

    t.is(myNaming.modDelim, '--');
    t.is(myNaming.modValDelim, naming.modValDelim);
});
