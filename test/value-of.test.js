import test from 'ava';

import BemEntityName from '../lib/entity-name';

test('should return normalized object', t => {
    const entity = new BemEntityName({ block: 'block', mod: 'mod' });

    t.deepEqual(entity.valueOf(), { block: 'block', mod: { name: 'mod', val: true } });
});
