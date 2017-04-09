import test from 'ava';

import BemEntityName from '../index';

test('should export to default', t => {
    t.is(BemEntityName, BemEntityName.default);
});
