const test = require('ava');

const BemEntityName = require('../index');

test('should throw error for if entity object is not valid', t => {
    t.throws(
        () => new BemEntityName({ elem: 'elem' }),
        'This is not valid BEM entity: the field `block` is undefined.'
    );
});

test('should throw error for if mod object is empty', t => {
    t.throws(
        () => new BemEntityName({ block: 'block', mod: {} }),
        'This is not valid BEM entity: the field `mod.name` is undefined.'
    );
});

test('should throw error for if mod name is undefined', t => {
    t.throws(
        () => new BemEntityName({ block: 'block', mod: { val: 'val' } }),
        'This is not valid BEM entity: the field `mod.name` is undefined.'
    );
});

test('should throw error for if modName is undefined', t => {
    t.throws(
        () => new BemEntityName({ block: 'block', modVal: 'val' }),
        'This is not valid BEM entity: the field `mod.name` is undefined.'
    );
});
