'use strict';

const test = require('ava');
const bemNaming = require('../index');

test('should be a namespace', t => {
    const entities = ['block__elem'].map(bemNaming.parse);

    t.same(entities, [{ block: 'block', elem: 'elem' }]);
});

test('should be a original namespace', t => {
    const myNaming = bemNaming();
    const entities = ['block__elem'].map(myNaming.parse);

    t.same(entities, [{ block: 'block', elem: 'elem' }]);
});

test('should be a custom namespace', t => {
    const myNaming = bemNaming({ elem: '==' });
    const entities = ['block==elem'].map(myNaming.parse);

    t.same(entities, [{ block: 'block', elem: 'elem' }]);
});
