'use strict';

const test = require('ava');
const bemNaming = require('../index');

test('should be a namespace', t => {
    const entities = ['block__elem'].map(bemNaming.parse);
    const entity = entities[0];

    t.deepEqual(entity.valueOf(), { block: 'block', elem: 'elem' });
});

test('should be a original namespace', t => {
    const myNaming = bemNaming();
    const entities = ['block__elem'].map(myNaming.parse);
    const entity = entities[0];

    t.deepEqual(entity.valueOf(), { block: 'block', elem: 'elem' });
});

test('should be a custom namespace', t => {
    const myNaming = bemNaming({ delims: { elem: '==' } });
    const entities = ['block==elem'].map(myNaming.parse);
    const entity = entities[0];

    t.deepEqual(entity.valueOf(), { block: 'block', elem: 'elem' });
});
