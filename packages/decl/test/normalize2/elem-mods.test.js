'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

describe('normalize2.elem-mods', () => {
    it('should support elem as object with mods', () => {
        const decl = {
            block: 'block',
            elem: {
                elem: 'elem',
                mods: {
                    mod1: 'v1'
                }
            }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: 'v1' }, tech: null }
        ]);
    });

    it('should support elem as object with mods inside and outside', () => {
        const decl = {
            block: 'block',
            elem: {
                elem: 'elem',
                mods: {
                    mod1: 'v1'
                }
            },
            mods: { mod2: 'v2' }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: 'v1' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod2', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod2', modVal: 'v2' }, tech: null }
        ]);
    });

    it('should support elem of elem as array mods', () => {
        const decl = {
            block: 'block',
            elem: [
                {
                    elem: ['elem1', 'elem2'],
                    mods: {
                        m1: 'v1'
                    }
                }
            ]
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem1' }, tech: null },
            { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: 'v1' }, tech: null },
            { entity: { block: 'block', elem: 'elem2' }, tech: null },
            { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: 'v1' }, tech: null }
        ]);
    });

    it('should support array of mod values', () => {
        const decl1 = {
            block: 'block',
            elem: 'elem',
            mods: ['m1', 'm2']
        };
        const decl2 = {
            block: 'block',
            elem: ['elem'],
            mods: ['m1', 'm2']
        };
        const result = [
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'm2', modVal: true }, tech: null }
        ];

        expect(normalize(decl1).map(simplifyCell)).to.deep.equal(result, 'if elem is a string');
        expect(normalize(decl2).map(simplifyCell)).to.deep.equal(result, 'if elem is an array');
    });
});
