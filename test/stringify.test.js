'use strict';

const test = require('ava');
const naming = require('../index');

test('should not stringify not valid notation', t => {
    const str = naming.stringify({});

    t.is(str, undefined);
});
