'use strict';

const test = require('ava');
const BemEntityName = require('@bem/sdk.entity-name');

const BemCell = require('../index');

test('should return stringified cell', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'button' }),
        tech: 'olala'
    });

    t.is(JSON.stringify([cell]), '[{"entity":{"block":"button"},"tech":"olala"}]');
});
