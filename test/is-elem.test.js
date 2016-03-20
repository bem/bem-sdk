'use strict';

const test = require('ava');
const naming = require('../lib/bem-naming');

test('should detect elem', t => {
    const entity = { block: 'block', elem: 'elem' };

    t.true(naming.isElem(entity));
});
