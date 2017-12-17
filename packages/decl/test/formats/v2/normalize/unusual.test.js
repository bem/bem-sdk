'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../../../util').simplifyCell;
const normalize = require('../../../../lib/formats/v2/normalize');

describe('normalize2.unusual', () => {
    it('should support both mod and mods', () => {
        const decl = {
            block: 'block',
            mod: 'mod',
            mods: { m1: 'v1' }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: null }
        ]);
    });

    it('should support both elem and elems', () => {
        const decl = {
            block: 'block',
            elem: 'elem1',
            elems: {
                elem: 'elem2'
            }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem1' }, tech: null },
            { entity: { block: 'block', elem: 'elem2' }, tech: null }
        ]);
    });

    it('should support both mod, mods, elem and elems :\'(', () => {
        const decl = {
            block: 'block',
            elem: 'elem1',
            elems: {
                elem: 'elem2'
            },
            mod: 'mod1',
            val: 'v1',
            mods: {
                mod2: 'v2'
            }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem1' }, tech: null },
            { entity: { block: 'block', elem: 'elem1', modName: 'mod1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem1', modName: 'mod1', modVal: 'v1' }, tech: null },
            { entity: { block: 'block', elem: 'elem1', modName: 'mod2', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem1', modName: 'mod2', modVal: 'v2' }, tech: null },
            { entity: { block: 'block', elem: 'elem2' }, tech: null }
        ]);
    });
});
