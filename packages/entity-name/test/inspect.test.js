import {inspect} from 'util'

import test from 'ava';

import BemEntityName from '..';

test('should return entity object', t => {
    const obj = { block: 'block' };
    const entityName = new BemEntityName(obj);

    t.is(inspect(entityName), `BemEntityName { block: 'block' }`);
});
