import test from 'ava';

import BemEntityName from '../lib/entity-name';

test('should check valid entities', t => {
    const entityName = new BemEntityName({ block: 'block' });

    t.true(BemEntityName.isBemEntityName(entityName));
});

test('should not pass entity representation object', t => {
    t.falsy(BemEntityName.isBemEntityName({ block: 'block' }));
});

test('should not pass invalid entity', t => {
    t.falsy(BemEntityName.isBemEntityName(new Array()));
});

test('should not pass null', t => {
    t.falsy(BemEntityName.isBemEntityName(null));
});

test('should not pass undefined', t => {
    t.falsy(BemEntityName.isBemEntityName(null));
});
