const test = require('ava');
const BemEntityName = require('@bem/entity-name');

const BemCell = require('../index');

test('should return string', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' })
    });

    t.truthy(typeof cell.toString() === 'string');
    t.truthy(cell.toString() === cell.id);
});
