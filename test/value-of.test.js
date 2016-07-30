const test = require('ava');

const BemEntityName = require('../index');

test('should return entity object', t => {
    const obj = { block: 'block' };
    const entity = new BemEntityName(obj);

    t.deepEqual(entity.valueOf(), obj);
});
