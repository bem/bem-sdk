'use strict';

const test = require('ava');
const naming = require('..');

test.failing('should be elem delim by default', t => {
    const instance1 = naming({ delims: { elem: '__' } });
    const instance2 = naming();

    t.is(instance1, instance2);
});

test.failing('should be mod delim by default', t => {
    const instance1 = naming({ delims: { mod: { name: '_' } } });
    const instance2 = naming();

    t.is(instance1, instance2);
});

test.failing('should be mod value delim by default', t => {
    const instance1 = naming({ delims: { mod: { val: '_' } } });
    const instance2 = naming();

    t.is(instance1, instance2);
});
