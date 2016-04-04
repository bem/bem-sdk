import test from 'ava';

import BemEntity from '../index';

test('should provide `block` field', t => {
    const entity = new BemEntity({ block: 'block' });

    t.is(entity.block, 'block');
});

test('should provide `elem` field', t => {
    const entity = new BemEntity({ block: 'block', elem: 'elem' });

    t.is(entity.elem, 'elem');
});

test('should provide `mod` field', t => {
    const entity = new BemEntity({ block: 'block', mod: { name: 'mod', val: 'val' } });

    t.same(entity.mod, { name: 'mod', val: 'val' });
});
