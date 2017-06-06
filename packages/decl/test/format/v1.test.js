'use strict';

const test = require('ava');
const BemCell = require('@bem/cell');

const format = require('../../lib/format');

function cellify(entities) {
    return entities.map(BemCell.create);
}

test('must return empty decl', t => {
    t.deepEqual(format([], { format: 'v1' }), []);
});

test('must group elems of one block', t => {
    const input = cellify([
        { block: 'block1' },
        { block: 'block1', elem: 'elem1' },
        { block: 'block1', elem: 'elem2' }
    ]);
    const output = [{ name: 'block1', elems: [{ name: 'elem1' }, { name: 'elem2' }] }];

    t.deepEqual(
        format(input, { format: 'v1' }),
        output
    );
});

test('must group mods of one block', t => {
    const input = cellify([
        { block: 'block1' },
        { block: 'block1', modName: 'mod1', modVal: 'val1' },
        { block: 'block1', modName: 'mod2', modVal: 'val2' }
    ]);
    const output = [{
        name: 'block1',
        mods: [
            { name: 'mod1', vals: ['val1'] },
            { name: 'mod2', vals: ['val2'] }
        ]
    }];

    t.deepEqual(
        format(input, { format: 'v1' }),
        output
    );
});

test('must group vals of mods block', t => {
    const input = cellify([
        { block: 'block1' },
        { block: 'block1', modName: 'mod1', modVal: true },
        { block: 'block1', modName: 'mod1', modVal: 'val1' }
    ]);
    const output = [{
        name: 'block1',
        mods: [{ name: 'mod1', vals: [true, 'val1'] }]
    }];

    t.deepEqual(
        format(input, { format: 'v1' }),
        output
    );
});

test('must group elem mods of block', t => {
    const input = cellify([
        { block: 'block1' },
        { block: 'block1', elem: 'elem1', modName: 'mod1', modVal: 'val1' },
        { block: 'block1', elem: 'elem1', modName: 'mod2', modVal: 'val2' }
    ]);
    const output = [{
        name: 'block1',
        elems: [{
            name: 'elem1',
            mods: [{ name: 'mod1', vals: ['val1'] }, { name: 'mod2', vals: ['val2'] }]
        }]
    }];

    t.deepEqual(
        format(input, { format: 'v1' }),
        output
    );
});

test('must group vals of elem mods', t => {
    const input = cellify([
        { block: 'block1' },
        { block: 'block1', elem: 'elem1', modName: 'mod1', modVal: 'val1' },
        { block: 'block1', elem: 'elem1', modName: 'mod1', modVal: 'val2' }
    ]);
    const output = [{
        name: 'block1',
        elems: [{
            name: 'elem1',
            mods: [{ name: 'mod1', vals: ['val1', 'val2'] }]
        }]
    }];

    t.deepEqual(
        format(input, { format: 'v1' }),
        output
    );
});

test('should create full entity with mods', t => {
    t.deepEqual(
        format(BemCell.create({ block: 'block1', modName: 'mod1', modVal: 'val1' }), { format: 'v1' }),
        [{
            name: 'block1',
            mods: [{
                name: 'mod1',
                vals: ['val1']
            }]
        }]
    );
});

test('should not group different blocks', t => {
    t.deepEqual(
        format(cellify([
            { block: 'block1' },
            { block: 'block2' },
            { block: 'block3' }
        ]), { format: 'v1' }),
        [{ name: 'block1' }, { name: 'block2' }, { name: 'block3' }]
    );
});

test('should not group different blocks with equal elems', t => {
    const input = cellify([
        { block: 'block1', elem: 'elem' },
        { block: 'block2', elem: 'elem' }
    ]);
    const output = [{
        name: 'block1',
        elems: [{ name: 'elem' }]
    }, {
        name: 'block2',
        elems: [{ name: 'elem' }]
    }];

    t.deepEqual(
        format(input, { format: 'v1' }),
        output
     );
});

test('should not group equal vals of different mods', t => {
    const input = cellify([
        { block: 'block1', elem: 'elem', modName: 'mod1', modVal: 'val1' },
        { block: 'block1', elem: 'elem', modName: 'mod2', modVal: 'val1' }
    ]);
    const output = [{
        name: 'block1',
        elems: [{
            name: 'elem',
            mods: [{
                name: 'mod1',
                vals: ['val1']
            }, {
                name: 'mod2',
                vals: ['val1']
            }]
        }]
    }];

    t.deepEqual(
        format(input, { format: 'v1' }),
        output
     );
});

test('should not group equal mods of different elems', t => {
    const input = cellify([
        { block: 'block1', elem: 'elem1', modName: 'mod1', modVal: 'val1' },
        { block: 'block1', elem: 'elem2', modName: 'mod1', modVal: 'val1' }
    ]);
    const output = [{
        name: 'block1',
        elems: [{
            name: 'elem1',
            mods: [{
                name: 'mod1',
                vals: ['val1']
            }]
        }, {
            name: 'elem2',
            mods: [{
                name: 'mod1',
                vals: ['val1']
            }]
        }]
    }];

    t.deepEqual(
        format(input, { format: 'v1' }),
        output
     );
});

test('should not break order of different entities', t => {
    const input = cellify([
        { block: 'block1', elem: 'elem1' },
        { block: 'block2' },
        { block: 'block1', elem: 'elem1', modName: 'mod1', modVal: 'val1' }
    ]);
    const output = [
        {
            name: 'block1',
            elems: [{ name: 'elem1' }]
        },
        { name: 'block2' },
        {
            name: 'block1',
            elems: [{
                name: 'elem1',
                mods: [{
                    name: 'mod1',
                    vals: ['val1']
                }]
            }]
        }
    ];

    t.deepEqual(
        format(input, { format: 'v1' }),
        output
     );
});

test('should not break order of different entities with complex entities', t => {
    const input = cellify([
        { block: 'block1', elem: 'elem1' },
        { block: 'block2' },
        { block: 'block1', elem: 'elem1', modName: 'mod1', modVal: 'val1' },
        { block: 'block2', modName: 'mod2', modVal: 'val2' },
        { block: 'block2', elem: 'elem2' }
    ]);
    const output = [
        {
            name: 'block1',
            elems: [{ name: 'elem1' }]
        },
        { name: 'block2' },
        {
            name: 'block1',
            elems: [{
                name: 'elem1',
                mods: [{
                    name: 'mod1',
                    vals: ['val1']
                }]
            }]
        },
        {
            name: 'block2',
            mods: [{
                name: 'mod2',
                vals: ['val2']
            }],
            elems: [{ name: 'elem2' }]
        }
    ];

    t.deepEqual(
        format(input, { format: 'v1' }),
        output
     );
});
