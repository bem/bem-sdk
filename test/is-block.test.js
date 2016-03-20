'use strict';

const test = require('ava');
const naming = require('../index');

test('should detect block by object', t => {
    const entity = { block: 'block' };

    t.true(naming.isBlock(entity));
});

test('should detect block by string', t => {
    const entity = 'block';

    t.true(naming.isBlock(entity));
});
