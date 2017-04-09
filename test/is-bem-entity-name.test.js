import test from 'ava';

import BemEntityName from '../index';

test('should check valid entities', t => {
    const entityName = new BemEntityName({ block: 'block' });

    t.true(BemEntityName.isBemEntityName(entityName));
});

test('should not pass invalid blocks', t => {
    t.falsy(BemEntityName.isBemEntityName(new Array()));
});

test('should not pass null', t => {
    t.falsy(BemEntityName.isBemEntityName(null));
});
