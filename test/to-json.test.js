import test from 'ava';

import BemEntityName from '..';

test('should create stringified object', t => {
    const entityName = new BemEntityName({ block: 'button' });

    t.is(JSON.stringify([entityName]), '[{"block":"button"}]');
});

test('should return normalized object', t => {
    const entityName = new BemEntityName({ block: 'button' });

    t.deepEqual(entityName.toJSON(), entityName.valueOf());
});
