'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = c => Object.assign({tech: null}, c.valueOf());
const assign = require('..').assign;

describe('assign', () => {
    it('entity block should dominate scope’s one', () => {
        expect(simplifyCell(assign(
            { entity: { block: 'b' } },
            { entity: { block: 'sb' } }))).to.deep.equal(
            { entity: { block: 'b' }, tech: null });
    });

    it('entity block should correcly assign with block-elem from scope', () => {
        expect(simplifyCell(assign(
            { entity: { block: 'b' } },
            { entity: { block: 'sb', elem: 'se' } }))).to.deep.equal(
            { entity: { block: 'b' }, tech: null });
    });

    it('entity block should correcly assign with block-mod from scope', () => {
        expect(simplifyCell(assign(
            { entity: { block: 'b' } },
            { entity: { block: 'sb', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'b' }, tech: null });
    });

    it('entity elem should dominate scope’s one', () => {
        expect(simplifyCell(assign(
            { entity: { block: 'b', elem: 'e' } },
            { entity: { block: 'sb', elem: 'sb' } }))).to.deep.equal(
            { entity: { block: 'b', elem: 'e' }, tech: null });
    });

    it('entity modName should dominate scope’s one for block', () => {
        expect(simplifyCell(assign(
            { entity: { block: 'b', mod: { name: 'm' } } },
            { entity: { block: 'sb', mod: { name: 'sm' } } }))).to.deep.equal(
            { entity: { block: 'b', mod: { name: 'm', val: true }}, tech: null });
    });

    it('entity modVal should dominate scope’s one for block', () => {
        expect(simplifyCell(assign(
            { entity: { block: 'b', mod: { name: 'm', val: 'v' } } },
            { entity: { block: 'sb', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'b', mod: { name: 'm', val: 'v' } }, tech: null });
    });

    it('entity elem should NOT be filled with scope elem for block', () => {
        expect(simplifyCell(assign(
            { entity: { block: 'b', mod: { name: 'm', val: 'v' } } },
            { entity: { block: 'sb', elem: 'se' } }))).to.deep.equal(
            { entity: { block: 'b', mod: { name: 'm', val: 'v' } }, tech: null });
    });

    it('entity modName should dominate scope’s one for block and elem', () => {
        expect(simplifyCell(assign(
            { entity: { block: 'b', elem: 'e', mod: { name: 'm' } } },
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm' } } }))).to.deep.equal(
            { entity: { block: 'b', elem: 'e', mod: { name: 'm', val: true }}, tech: null });
    });

    it('entity modVal should dominate scope’s one for block and elem', () => {
        expect(simplifyCell(assign(
            { entity: { block: 'b', elem: 'e', mod: { name: 'm', val: 'v' } } },
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'b', elem: 'e', mod: { name: 'm', val: 'v' } }, tech: null });
    });

    it('entity with block should not be filled with scope\'s modName/modVal', () => {
        expect(simplifyCell(assign(
            { entity: { block: 'b' } },
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'b' }, tech: null });
    });

    it('entity with block and elem should not be filled with scope\'s modName/modVal', () => {
        expect(simplifyCell(assign(
            { entity: { block: 'b', elem: 'e' } },
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'b', elem: 'e' }, tech: null });
    });

    it('entity with elem should be filled with block only', () => {
        expect(simplifyCell(assign(
            { entity: { elem: 'e' } },
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'sb', elem: 'e' }, tech: null });
    });

    it('entity elem should use scope’s block', () => {
        expect(simplifyCell(assign(
            { entity: { elem: 'e' } },
            { entity: { block: 'sb', elem: 'se' } }))).to.deep.equal(
            { entity: { block: 'sb', elem: 'e' }, tech: null });
    });

    it('entity modName should use scope’s block', () => {
        expect(simplifyCell(assign(
            { entity: { mod: { name: 'm' } } },
            { entity: { block: 'sb', mod: { name: 'sm' } } }))).to.deep.equal(
            { entity: { block: 'sb', mod: { name: 'm', val: true }}, tech: null });
    });

    it('entity modName should use scope’s elem', () => {
        expect(simplifyCell(assign(
            { entity: { mod: { name: 'm' } } },
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm' } } }))).to.deep.equal(
            { entity: { block: 'sb', elem: 'se', mod: { name: 'm', val: true }}, tech: null });
    });

    it('entity modVal should use scope’s block and modName', () => {
        expect(simplifyCell(assign(
            { entity: { mod: { val: 'v' } } },
            { entity: { block: 'sb', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'sb', mod: { name: 'sm', val: 'v' } }, tech: null });
    });

    it('entity modVal should use scope’s block, elem and modName', () => {
        expect(simplifyCell(assign(
            { entity: { mod: { val: 'v' } } },
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm', val: 'v' } }, tech: null });
    });

    it('should assign entity for mod and val for block', () => {
        expect(simplifyCell(assign(
            { entity: { mod: { name: 'm', val: 'v' } } },
            { entity: { block: 'sb' } }))).to.deep.equal(
            { entity: { block: 'sb', mod: { name: 'm', val: 'v' } }, tech: null });
    });

    it('should assign entity for mod and val for block and elem', () => {
        expect(simplifyCell(assign(
            { entity: { mod: { name: 'm', val: 'v' } } },
            { entity: { block: 'sb', elem: 'se' } }))).to.deep.equal(
            { entity: { block: 'sb', elem: 'se', mod: { name: 'm', val: 'v' } }, tech: null });
    });

    it('should cut modName and modVal from scope for elem', () => {
        expect(simplifyCell(assign(
            { entity: { elem: 'e' } },
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'sb', elem: 'e' }, tech: null });
    });

    it('should cut modVal from scope for modName', () => {
        expect(simplifyCell(assign(
            { entity: { mod: { name: 'm' } } },
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'sb', elem: 'se', mod: { name: 'm', val: true }}, tech: null });
    });

    it('should use only block from scope for elem and modName', () => {
        expect(simplifyCell(assign(
            { entity: { elem: 'e', mod: { name: 'm' } } },
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'sb', elem: 'e', mod: { name: 'm', val: true }}, tech: null });
    });

// Edge cases

    it('should allow 0 as mod value', () => {
        expect(simplifyCell(assign(
            { entity: { mod: { val: 0 } } },
            { entity: { block: 'sb', mod: { name: 'sm' } } }))).to.deep.equal(
            { entity: { block: 'sb', mod: { name: 'sm', val: '0' } }, tech: null });
    });

    it('should use block for nothing', () => {
        expect(simplifyCell(assign(
            { entity: {} },
            { entity: { block: 'sb' } }))).to.deep.equal(
            { entity: { block: 'sb' }, tech: null });
    });

    it('should throw on empty without scope', () => {
        expect(
            () => {
                simplifyCell(assign(
                    { entity: {} },
                    { entity: {} }));
            }
        ).to.throw();
    });

    it('should use scope with block if entity has empty fields', () => {
        expect(simplifyCell(assign(
            { entity: { block: undefined, elem: undefined, mod: undefined } },
            { entity: { block: 'sb' } }))).to.deep.equal(
            { entity: { block: 'sb' }, tech: null });
    });

    it('should use scope with block and boolean modifier if entity has empty fields', () => {
        expect(simplifyCell(assign(
            { entity: { block: undefined, elem: undefined, mod: undefined } },
            { entity: { block: 'sb', mod: { name: 'sm', val: true }} }))).to.deep.equal(
            { entity: { block: 'sb', mod: { name: 'sm', val: true }}, tech: null });
    });

    it('should use scope with block and modifier if entity has empty fields', () => {
        expect(simplifyCell(assign(
            { entity: { block: undefined, elem: undefined, mod: undefined } },
            { entity: { block: 'sb', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'sb', mod: { name: 'sm', val: 'sv' } }, tech: null });
    });

    it('should use scope with elem if entity has empty fields', () => {
        expect(simplifyCell(assign(
            { entity: { block: undefined, elem: undefined, mod: undefined } },
            { entity: { block: 'sb', elem: 'se' } }))).to.deep.equal(
            { entity: { block: 'sb', elem: 'se' }, tech: null });
    });

    it('should use scope with elem and boolean modifier if entity has empty fields', () => {
        expect(simplifyCell(assign(
            { entity: { block: undefined, elem: undefined, mod: undefined } },
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm', val: true }} }))).to.deep.equal(
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm', val: true }}, tech: null });
    });

    it('should use scope with elem and modifier if entity has empty fields', () => {
        expect(simplifyCell(assign(
            { entity: { block: undefined, elem: undefined, mod: undefined } },
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'sb', elem: 'se', mod: { name: 'sm', val: 'sv' } }, tech: null });
    });

    it('should use modVal from scope if nothing given', () => {
        expect(simplifyCell(assign(
            {},
            { entity: { block: 'sb', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'sb', mod: { name: 'sm', val: 'sv' } }, tech: null });
    });

    it('should not use modVal from scope if only block given', () => {
        expect(simplifyCell(assign(
            { entity: { mod: { val: 'sv' } } },
            { entity: { block: 'sb' } }))).to.deep.equal(
            { entity: { block: 'sb' }, tech: null });
    });

    it('should not use modVal from scope if only elem given', () => {
        expect(simplifyCell(assign(
            { entity: { mod: { val: 'sv' } } },
            { entity: { block: 'sb', elem: 'se' } }))).to.deep.equal(
            { entity: { block: 'sb', elem: 'se' }, tech: null });
    });

// Tech related specs

    it('assign should support tech grabbing from scope', () => {
        expect(simplifyCell(assign(
            { entity: { block: 'b' } },
            { entity: { block: 'sb' }, tech: 'js' }))).to.deep.equal(
            { entity: { block: 'b' }, tech: 'js' });
    });

    it('entity tech should dominate the scope’s one', () => {
        expect(simplifyCell(assign(
            { entity: { block: 'b' }, tech: 'bemhtml' },
            { entity: { block: 'sb' }, tech: 'js' }))).to.deep.equal(
            { entity: { block: 'b' }, tech: 'bemhtml' });
    });

    it('should merge with scope if only tech given', () => {
        expect(simplifyCell(assign(
            { tech: 'bemhtml' },
            { entity: { block: 'sb', elem: 'se' } }))).to.deep.equal(
            { entity: { block: 'sb', elem: 'se' }, tech: 'bemhtml' });
    });

    it('should use modVal with scope if only tech given', () => {
        expect(simplifyCell(assign(
            { tech: 'bemhtml' },
            { entity: { block: 'sb', mod: { name: 'sm', val: 'sv' } } }))).to.deep.equal(
            { entity: { block: 'sb', mod: { name: 'sm', val: 'sv' } }, tech: 'bemhtml' });
    });

    it('should use scope vals if null given', () => {
        expect(
            simplifyCell(assign(
                { entity: { block: null, mod: { name: 'mod', val: 'val' } } },
                { entity: { block: 'block', elem: 'elem' }, tech: 'bemhtml' }
            )),
            { entity: { block: 'block', elem: 'elem', mod: { name: 'mod', val: 'val' } }, tech: 'bemhtml' }
        );
    });

    it('should use scope elem if block null', () => {
        expect(
            simplifyCell(assign(
                { entity: { block: null }, tech: 'js' },
                { entity: { block: 'block', elem: 'elem' } }
            )),
            { entity: { block: 'block', elem: 'elem' }, tech: 'js' }
        );
    });
});
