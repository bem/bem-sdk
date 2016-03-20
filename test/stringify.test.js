'use strict';

const test = require('ava');
const naming = require('../index');

test('should not stringify not valid notation', t => {
    t.throws(() => {
        naming.stringify({});
    }, 'The field `block` is undefined. It is impossible to stringify BEM notation.');
});
