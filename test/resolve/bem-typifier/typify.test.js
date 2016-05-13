'use strict';

const test = require('ava');

const BemTypifier = require('../../../lib/resolve/bem-typifier');
const findIndex = require('../../../spec/utils').findIndex;

test('should typify block', t => {
    var typifier = new BemTypifier(),
        entity = { block: 'A' };

    typifier.typify(entity);

    t.not(findIndex(Array.from(typifier.blocks()), entity), -1);
});

test('should typify modificator of block', t => {
    var typifier = new BemTypifier(),
        entity = { block: 'A', modName: 'm' };

    typifier.typify(entity);

    t.not(findIndex(Array.from(typifier.blockModificators()), entity), -1);
});

test('should typify element', t => {
    var typifier = new BemTypifier(),
        entity = { block: 'A', elem: 'e' };

    typifier.typify(entity);

    t.not(findIndex(Array.from(typifier.elements()), entity), -1);
});

test('should typify modificator of element', t => {
    var typifier = new BemTypifier(),
        entity = { block: 'A', elem: 'e', modName: 'm' };

    typifier.typify(entity);

    t.not(findIndex(Array.from(typifier.elementModificators()), entity), -1);
});
