'use strict';

const test = require('ava');
const assign = require('..').assign;

test('entity block should dominate scope’s one', t => {
    t.deepEqual(assign(
        { entity: { block: 'b' } },
        { entity: { block: 'sb' } }),
        { entity: { block: 'b' }, tech: null });
});

test('entity elem should dominate scope’s one', t => {
    t.deepEqual(assign(
        { entity: { block: 'b', elem: 'e' } },
        { entity: { block: 'sb', elem: 'sb' } }),
        { entity: { block: 'b', elem: 'e' }, tech: null });
});

test('entity modName should dominate scope’s one for block', t => {
    t.deepEqual(assign(
        { entity: { block: 'b', modName: 'm' } },
        { entity: { block: 'sb', modName: 'sm' } }),
        { entity: { block: 'b', modName: 'm' }, tech: null });
});

test('entity modVal should dominate scope’s one for block', t => {
    t.deepEqual(assign(
        { entity: { block: 'b', modName: 'm', modVal: 'v' } },
        { entity: { block: 'sb', modName: 'sm', modVal: 'sv' } }),
        { entity: { block: 'b', modName: 'm', modVal: 'v' }, tech: null });
});

test('entity elem should NOT be filled with scope elem for block', t => {
    t.deepEqual(assign(
        { entity: { block: 'b', modName: 'm', modVal: 'v' } },
        { entity: { block: 'sb', elem: 'se' } }),
        { entity: { block: 'b', modName: 'm', modVal: 'v' }, tech: null });
});

test('entity modName should dominate scope’s one for block and elem', t => {
    t.deepEqual(assign(
        { entity: { block: 'b', elem: 'e', modName: 'm' } },
        { entity: { block: 'sb', elem: 'se', modName: 'sm' } }),
        { entity: { block: 'b', elem: 'e', modName: 'm' }, tech: null });
});

test('entity modVal should dominate scope’s one for block and elem', t => {
    t.deepEqual(assign(
        { entity: { block: 'b', elem: 'e', modName: 'm', modVal: 'v' } },
        { entity: { block: 'sb', elem: 'se', modName: 'sm', modVal: 'sv' } }),
        { entity: { block: 'b', elem: 'e', modName: 'm', modVal: 'v' }, tech: null });
});

test('entity with block should not be filled with scope\'s modName/modVal', t => {
    t.deepEqual(assign(
        { entity: { block: 'b' } },
        { entity: { block: 'sb', elem: 'se', modName: 'sm', modVal: 'sv' } }),
        { entity: { block: 'b' }, tech: null });
});

test('entity with block and elem should not be filled with scope\'s modName/modVal', t => {
    t.deepEqual(assign(
        { entity: { block: 'b', elem: 'e' } },
        { entity: { block: 'sb', elem: 'se', modName: 'sm', modVal: 'sv' } }),
        { entity: { block: 'b', elem: 'e' }, tech: null });
});

test('entity with elem should be filled with block only', t => {
    t.deepEqual(assign(
        { entity: { elem: 'e' } },
        { entity: { block: 'sb', elem: 'se', modName: 'sm', modVal: 'sv' } }),
        { entity: { block: 'sb', elem: 'e' }, tech: null });
});

test('entity elem should use scope’s block', t => {
    t.deepEqual(assign(
        { entity: { elem: 'e' } },
        { entity: { block: 'sb', elem: 'se' } }),
        { entity: { block: 'sb', elem: 'e' }, tech: null });
});

test('entity modName should use scope’s block', t => {
    t.deepEqual(assign(
        { entity: { modName: 'm' } },
        { entity: { block: 'sb', modName: 'sm' } }),
        { entity: { block: 'sb', modName: 'm' }, tech: null });
});

test('entity modName should use scope’s elem', t => {
    t.deepEqual(assign(
        { entity: { modName: 'm' } },
        { entity: { block: 'sb', elem: 'se', modName: 'sm' } }),
        { entity: { block: 'sb', elem: 'se', modName: 'm' }, tech: null });
});

test('entity modVal should use scope’s block and modName', t => {
    t.deepEqual(assign(
        { entity: { modVal: 'v' } },
        { entity: { block: 'sb', modName: 'sm', modVal: 'sv' } }),
        { entity: { block: 'sb', modName: 'sm', modVal: 'v' }, tech: null });
});

test('entity modVal should use scope’s block, elem and modName', t => {
    t.deepEqual(assign(
        { entity: { modVal: 'v' } },
        { entity: { block: 'sb', elem: 'se', modName: 'sm', modVal: 'sv' } }),
        { entity: { block: 'sb', elem: 'se', modName: 'sm', modVal: 'v' }, tech: null });
});

test('should assign entity for mod and val for block', t => {
    t.deepEqual(assign(
        { entity: { modName: 'm', modVal: 'v' } },
        { entity: { block: 'sb' } }),
        { entity: { block: 'sb', modName: 'm', modVal: 'v' }, tech: null });
});

test('should assign entity for mod and val for block and elem', t => {
    t.deepEqual(assign(
        { entity: { modName: 'm', modVal: 'v' } },
        { entity: { block: 'sb', elem: 'se' } }),
        { entity: { block: 'sb', elem: 'se', modName: 'm', modVal: 'v' }, tech: null });
});

test('should cut modName and modVal from scope for elem', t => {
    t.deepEqual(assign(
        { entity: { elem: 'e' } },
        { entity: { block: 'sb', elem: 'se', modName: 'sm', modVal: 'sv' } }),
        { entity: { block: 'sb', elem: 'e' }, tech: null });
});

test('should cut modVal from scope for modName', t => {
    t.deepEqual(assign(
        { entity: { modName: 'm' } },
        { entity: { block: 'sb', elem: 'se', modName: 'sm', modVal: 'sv' } }),
        { entity: { block: 'sb', elem: 'se', modName: 'm' }, tech: null });
});

// Edge cases

test('should allow 0 as mod value', t => {
    t.deepEqual(assign(
        { entity: { modVal: 0 } },
        { entity: { block: 'sb', modName: 'sm' } }),
        { entity: { block: 'sb', modName: 'sm', modVal: 0 }, tech: null });
});

test('should use block for nothing', t => {
    t.deepEqual(assign(
        { entity: { } },
        { entity: { block: 'sb' } }),
        { entity: { block: 'sb' }, tech: null });
});

test('should return empty without scope', t => {
    t.deepEqual(assign(
        { entity: { } },
        { entity: { } }),
        { entity: { }, tech: null });
});

test('should use scope with block if entity has empty fields', t => {
    t.deepEqual(assign(
        { entity: { block: undefined, elem: undefined, modName: undefined, modVal: undefined } },
        { entity: { block: 'sb' } }),
        { entity: { block: 'sb' }, tech: null });
});

test('should use scope with block and boolean modifier if entity has empty fields', t => {
    t.deepEqual(assign(
        { entity: { block: undefined, elem: undefined, modName: undefined, modVal: undefined } },
        { entity: { block: 'sb', modName: 'sm', modVal: true } }),
        { entity: { block: 'sb', modName: 'sm', modVal: true }, tech: null });
});

test('should use scope with block and modifier if entity has empty fields', t => {
    t.deepEqual(assign(
        { entity: { block: undefined, elem: undefined, modName: undefined, modVal: undefined } },
        { entity: { block: 'sb', modName: 'sm', modVal: 'sv' } }),
        { entity: { block: 'sb', modName: 'sm', modVal: 'sv' }, tech: null });
});

test('should use scope with elem if entity has empty fields', t => {
    t.deepEqual(assign(
        { entity: { block: undefined, elem: undefined, modName: undefined, modVal: undefined } },
        { entity: { block: 'sb', elem: 'se' } }),
        { entity: { block: 'sb', elem: 'se' }, tech: null });
});

test('should use scope with elem and boolean modifier if entity has empty fields', t => {
    t.deepEqual(assign(
        { entity: { block: undefined, elem: undefined, modName: undefined, modVal: undefined } },
        { entity: { block: 'sb', elem: 'se', modName: 'sm', modVal: true } }),
        { entity: { block: 'sb', elem: 'se', modName: 'sm', modVal: true }, tech: null });
});

test('should use scope with elem and modifier if entity has empty fields', t => {
    t.deepEqual(assign(
        { entity: { block: undefined, elem: undefined, modName: undefined, modVal: undefined } },
        { entity: { block: 'sb', elem: 'se', modName: 'sm', modVal: 'sv' } }),
        { entity: { block: 'sb', elem: 'se', modName: 'sm', modVal: 'sv' }, tech: null });
});

test('should use modVal from scope if nothing given', t => {
    t.deepEqual(assign(
        { },
        { entity: { block: 'sb', modName: 'sm', modVal: 'sv' } }),
        { entity: { block: 'sb', modName: 'sm', modVal: 'sv' }, tech: null });
});

test('should not use modVal from scope if only block given', t => {
    t.deepEqual(assign(
        { entity: { modVal: 'sv' } },
        { entity: { block: 'sb' } }),
        { entity: { block: 'sb' }, tech: null });
});

test('should not use modVal from scope if only elem given', t => {
    t.deepEqual(assign(
        { entity: { modVal: 'sv' } },
        { entity: { block: 'sb', elem: 'se' } }),
        { entity: { block: 'sb', elem: 'se' }, tech: null });
});

// Tech related specs

test('assign should support tech grabbing from scope', t => {
    t.deepEqual(assign(
        { entity: { block: 'b' } },
        { entity: { }, tech: 'js' }),
        { entity: { block: 'b' }, tech: 'js' });
});

test('entity tech should dominate the scope’s one', t => {
    t.deepEqual(assign(
        { entity: { block: 'b' }, tech: 'bemhtml' },
        { entity: { }, tech: 'js' }),
        { entity: { block: 'b' }, tech: 'bemhtml' });
});

test('should merge with scope if only tech given', t => {
    t.deepEqual(assign(
        { tech: 'bemhtml' },
        { entity: { block: 'sb', elem: 'se' } }),
        { entity: { block: 'sb', elem: 'se' }, tech: 'bemhtml' });
});

test('should use modVal with scope if only tech given', t => {
    t.deepEqual(assign(
        { tech: 'bemhtml' },
        { entity: { block: 'sb', modName: 'sm', modVal: 'sv' } }),
        { entity: { block: 'sb', modName: 'sm', modVal: 'sv' }, tech: 'bemhtml' });
});

test('should use scope vals if null given', t => {
    t.deepEqual(
        assign(
            { entity: { block: null, modName: 'mod', modVal: 'val' } },
            { entity: { block: 'block', elem: 'elem' }, tech: 'bemhtml' }
        ),
        { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: 'bemhtml' }
    )
});

test('should use scope elem if block null', t => {
    t.deepEqual(
        assign(
            { entity: { block: null }, tech: 'js' },
            { entity: { block: 'block', elem: 'elem' } }
        ),
        { entity: { block: 'block', elem: 'elem' }, tech: 'js' }
    );
});
