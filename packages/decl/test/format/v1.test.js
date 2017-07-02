'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemCell = require('@bem/sdk.cell');

const format = require('../../lib/format');

function cellify(entities) {
    return entities.map(BemCell.create);
}

describe('format.v1', () => {
    it('must return empty decl', () => {
        expect(format([], { format: 'v1' })).to.deep.equal([]);
    });

    it('must group elems of one block', () => {
        const input = cellify([
            { block: 'block1' },
            { block: 'block1', elem: 'elem1' },
            { block: 'block1', elem: 'elem2' }
        ]);
        const output = [{ name: 'block1', elems: [{ name: 'elem1' }, { name: 'elem2' }] }];

        expect(format(input, { format: 'v1' })).to.deep.equal(output);
    });

    it('must group mods of one block', () => {
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

        expect(format(input, { format: 'v1' })).to.deep.equal(output);
    });

    it('must group vals of mods block', () => {
        const input = cellify([
            { block: 'block1' },
            { block: 'block1', modName: 'mod1', modVal: true },
            { block: 'block1', modName: 'mod1', modVal: 'val1' }
        ]);
        const output = [{
            name: 'block1',
            mods: [{ name: 'mod1', vals: [true, 'val1'] }]
        }];

        expect(format(input, { format: 'v1' })).to.deep.equal(output);
    });

    it('must group elem mods of block', () => {
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

        expect(format(input, { format: 'v1' })).to.deep.equal(output);
    });

    it('must group vals of elem mods', () => {
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

        expect(format(input, { format: 'v1' })).to.deep.equal(output);
    });

    it('should create full entity with mods', () => {
        const input = BemCell.create({ block: 'block1', modName: 'mod1', modVal: 'val1' });
        const output = [{
            name: 'block1',
            mods: [{
                name: 'mod1',
                vals: ['val1']
            }]
        }];

        expect(format(input, { format: 'v1' })).to.deep.equal(output);
    });

    it('should not group different blocks', () => {
        const input = cellify([
            { block: 'block1' },
            { block: 'block2' },
            { block: 'block3' }
        ]);

        const output = [{ name: 'block1' }, { name: 'block2' }, { name: 'block3' }];

        expect(format(input, { format: 'v1' })).to.deep.equal(output);
    });

    it('should not group different blocks with equal elems', () => {
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

        expect(format(input, { format: 'v1' })).to.deep.equal(output);
    });

    it('should not group equal vals of different mods', () => {
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

        expect(format(input, { format: 'v1' })).to.deep.equal(output);
    });

    it('should not group equal mods of different elems', () => {
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

        expect(format(input, { format: 'v1' })).to.deep.equal(output);
    });

    it('should not break order of different entities', () => {
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

        expect(format(input, { format: 'v1' })).to.deep.equal(output);
    });

    it('should not break order of different entities with complex entities', () => {
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

        expect(format(input, { format: 'v1' })).to.deep.equal(output);
    });
});
