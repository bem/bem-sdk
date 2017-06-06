import test from 'ava';

import BemjsonNode from '../..';

test('should throw error if not `block` field', t => {
    t.throws(
        () => new BemjsonNode({ elem: 'elem' }),
        /`block` field should be a non empty string/
    );
});

test('should throw error if `elem` field has non-string value', t => {
    t.throws(
        () => new BemjsonNode({ block: 'b', elem: {} }),
        /`elem` field should be a non-empty string/
    );
});

test('should throw error if `elemMods` field is empty object', t => {
    t.throws(
        () => new BemjsonNode({ block: 'block', elemMods: {} }),
        /`elemMods` field should not be used without `elem` field/
    );
});

test('should throw error if `mods` field has invalid value', t => {
    t.throws(
        () => new BemjsonNode({ block: 'block', mods: 'string' }),
        /`mods` field should be a simple object or null/
    );
});

test('should throw error if `elemMods` field used is empty object', t => {
    t.throws(
        () => new BemjsonNode({ block: 'block', elem: 'e', elemMods: 'string' }),
        /`elemMods` field should be a simple object or null/
    );
});
