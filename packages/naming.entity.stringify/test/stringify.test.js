'use strict';

const test = require('ava');
const BemEntityName = require('@bem/entity-name');

const originNaming = require('@bem/sdk.naming.entity.presets/origin');
const stringify = require('../index')(originNaming);

test('should not stringify not valid notation', t => {
    const str = stringify({});

    t.is(str, '');
});

test('should support block instance of BemEntityName', t => {
    const obj = { block: 'block' };
    const entityName = new BemEntityName(obj);

    t.is(stringify(obj), stringify(entityName));
});

test('should support modifier instance of BemEntityName', t => {
    const obj = { block: 'block', mod: 'mod' };
    const entityName = new BemEntityName(obj);

    t.is(stringify(obj), stringify(entityName));
});

test('should support element instance of BemEntityName', t => {
    const obj = { block: 'block', elem: 'elem' };
    const entityName = new BemEntityName(obj);

    t.is(stringify(obj), stringify(entityName));
});

test('should support element modifier instance of BemEntityName', t => {
    const obj = { block: 'block', mod: 'mod' };
    const entityName = new BemEntityName(obj);

    t.is(stringify(obj), stringify(entityName));
});
