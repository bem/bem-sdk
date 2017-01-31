const test = require('ava');

const BemEntityName = require('../index');

test('should determine block', t => {
    const entityName = new BemEntityName({ block: 'block' });

    t.is(entityName.type, 'block');
});

test('should determine modifier of block', t => {
    const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod' } });

    t.is(entityName.type, 'blockMod');
});

test('should determine elem', t => {
    const entityName = new BemEntityName({ block: 'block', elem: 'elem' });

    t.is(entityName.type, 'elem');
});

test('should determine modifier of element', t => {
    const entityName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod' } });

    t.is(entityName.type, 'elemMod');
});

test('should cache type value', t => {
    const entity = new BemEntityName({ block: 'block' });

    entity.type; // eslint-disable-line no-unused-expressions

    t.is(entity._type, 'block');
});

test('should get type from cache', t => {
    const entity = new BemEntityName({ block: 'block' });

    entity._type = 'fake';

    t.is(entity.type, 'fake');
});
