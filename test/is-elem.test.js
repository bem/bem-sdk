'use strict';

const test = require('ava');
const naming = require('../index');

test('should detect elem', t => {
    const entity = { block: 'block', elem: 'elem' };

    t.true(naming.isElem(entity));
});
