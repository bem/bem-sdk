const test = require('ava');

const BemEntityName = require('../index');

test('should return stringified cell', t => {
    const cell = new BemEntityName({ block: 'button' });

    t.is(JSON.stringify([cell]), '[{"block":"button"}]');
});
