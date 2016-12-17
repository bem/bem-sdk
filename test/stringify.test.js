'use strict';

const test = require('ava');
const BemEntityName = require('@bem/entity-name');

const naming = require('../index');

test('should not stringify not valid notation', t => {
    const str = naming.stringify({});

    t.is(str, undefined);
});

test('should support block instance of BemEntityName', t => {
    const obj = { block: 'block' };
    const entityName = new BemEntityName(obj);

    t.is(naming.stringify(obj), naming.stringify(entityName));
});

test('should support modifier instance of BemEntityName', t => {
    const obj = { block: 'block', mod: 'mod' };
    const entityName = new BemEntityName(obj);

    t.is(naming.stringify(obj), naming.stringify(entityName));
});

test('should support element instance of BemEntityName', t => {
    const obj = { block: 'block', elem: 'elem' };
    const entityName = new BemEntityName(obj);

    t.is(naming.stringify(obj), naming.stringify(entityName));
});

test('should support element modifier instance of BemEntityName', t => {
    const obj = { block: 'block', mod: 'mod' };
    const entityName = new BemEntityName(obj);

    t.is(naming.stringify(obj), naming.stringify(entityName));
});
