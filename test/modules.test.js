const test = require('ava');

const BemEntityName = require('../index');

test('should export to default', t => {
    t.is(BemEntityName, BemEntityName.default);
});
