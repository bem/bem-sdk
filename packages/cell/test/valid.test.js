'use strict';

const test = require('ava');
const BemEntityName = require('@bem/sdk.entity-name');

const BemCell = require('../index');

test('should throw error if not provide arguments', t => {
    t.throws(
        () => new BemCell(),
        'Required `entity` field'
    );
});

test('should throw error if entity is undefined', t => {
    t.throws(
        () => new BemCell({}),
        'Required `entity` field'
    );
});

test('should throw error for if entity is undefined', t => {
    t.throws(
        () => new BemCell({ entity: { block: 'block' } }),
        'The `entity` field should be an instance of BemEntityName'
    );
});

test('should throw error for if entity is undefined', t => {
    t.notThrows(() => new BemCell({ entity: new BemEntityName({ block: 'block' }) }));
});
