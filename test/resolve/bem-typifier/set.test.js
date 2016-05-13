'use strict';

const test = require('ava');

const BemTypifier = require('../../../lib/resolve/bem-typifier');

test('should add same block only once', t => {
    const typifier = new BemTypifier();
    const entity = { block: 'A' };

    typifier.typify(entity);
    typifier.typify(entity);

    t.deepEqual(Array.from(typifier.blocks()), [entity]);
});

test('should add same modificator of block only once', t => {
    const typifier = new BemTypifier();
    const entity = { block: 'A', modName: 'm' };

    typifier.typify(entity);
    typifier.typify(entity);

    t.deepEqual(Array.from(typifier.blockModificators()), [entity]);
});

test('should add same element only once', t => {
    const typifier = new BemTypifier();
    const entity = { block: 'A', elem: 'e' };

    typifier.typify(entity);
    typifier.typify(entity);

    t.deepEqual(Array.from(typifier.elements()), [entity]);
});

test('should add same modificator of element only once', t => {
    const typifier = new BemTypifier();
    const entity = { block: 'A', elem: 'e', modName: 'm' };

    typifier.typify(entity);
    typifier.typify(entity);

    t.deepEqual(Array.from(typifier.elementModificators()), [entity]);
});
