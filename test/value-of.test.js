import test from 'ava';

import BemEntityName from '..';

test('should return normalized object', t => {
    const entity = new BemEntityName({ block: 'block', mod: 'mod' });

    t.deepEqual(entity.valueOf(), { block: 'block', mod: { name: 'mod', val: true } });
});
