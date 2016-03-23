'use strict';

const test = require('ava');
const naming = require('../index');

test('should be elem delim by default', t => {
    const instance1 = naming({ elem: '__' });
    const instance2 = naming();

    t.is(instance1, instance2);
});

test('should be mod delim by default', t => {
    const instance1 = naming({ mod: { name: '_' } });
    const instance2 = naming();

    t.is(instance1, instance2);
});

test('should be mod value delim by default', t => {
    const instance1 = naming({ mod: { val: '_' } });
    const instance2 = naming();

    t.is(instance1, instance2);
});
