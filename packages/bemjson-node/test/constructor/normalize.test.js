import test from 'ava';

import BemjsonNode from '../..';

test('should normalize mods field', t => {
    const node = new BemjsonNode({ block: 'block' });

    t.is(typeof node.mods, 'object');
});

test('should normalize elemMods field', t => {
    const node = new BemjsonNode({ block: 'block', elem: 'q' });

    t.is(typeof node.elemMods, 'object');
});

test('should normalize mix field into the array', t => {
    const mixedNode = new BemjsonNode({ block: 'mixed' });
    const node = new BemjsonNode({ block: 'block', mix: mixedNode });

    t.true(Array.isArray(node.mix));
    t.is(node.mix[0], mixedNode);
});

test('should normalize string value in the mix field', t => {
    const node = new BemjsonNode({ block: 'block', mix: 'mixed' });

    t.true(BemjsonNode.isBemjsonNode(node.mix[0]));
    t.is(node.mix[0].block, 'mixed');
});

test('should normalize object value in the mix field', t => {
    const node = new BemjsonNode({ block: 'b1', mix: {block: 'b1', elem: 'e1'} });

    t.true(BemjsonNode.isBemjsonNode(node.mix[0]));
    t.is(node.mix[0].elem, 'e1');
});
