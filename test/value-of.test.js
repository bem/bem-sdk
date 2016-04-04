import test from 'ava';

import BemEntity from '../index';

test('should return entity object', t => {
    const obj = { block: 'block' };
    const entity = new BemEntity(obj);

    t.same(entity.valueOf(), obj);
});
