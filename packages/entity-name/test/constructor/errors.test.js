import test from 'ava';

import BemEntityName from '../../lib/entity-name';

test('should throw error if not `block` field', t => {
    t.throws(
        () => new BemEntityName({ elem: 'elem' }),
        "the object `{ elem: 'elem' }` is not valid BEM entity, the field `block` is undefined"
    );
});

test('should throw error if `mod` field is empty object', t => {
    t.throws(
        () => new BemEntityName({ block: 'block', mod: {} }),
        "the object `{ block: 'block', mod: {} }` is not valid BEM entity, the field `mod.name` is undefined"
    );
});

test('should throw error if `mod.name` field is undefined', t => {
    t.throws(
        () => new BemEntityName({ block: 'block', mod: { val: 'val' } }),
        "the object `{ block: 'block', mod: { val: 'val' } }` is not valid BEM entity, the field `mod.name` is undefined"
    );
});
