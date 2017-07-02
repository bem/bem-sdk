'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

describe('normalize2.block-mods', () => {
    it('should support mods', () => {
        const decl = {
            block: 'block',
            mods: {
                m1: 'v1'
            }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: null }
        ]);
    });

    it('should pass mods to elem', () => {
        const decl = {
            block: 'block',
            elem: 'elem',
            mods: {
                m1: 'v1'
            }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'm1', modVal: 'v1' }, tech: null }
        ]);
    });

    it('should support several mods', () => {
        const decl = {
            block: 'block',
            mods: {
                m1: 'v1',
                m2: 'v2'
            }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: null },
            { entity: { block: 'block', modName: 'm2', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'm2', modVal: 'v2' }, tech: null }
        ]);
    });

    it('should support array of mod values in object', () => {
        const decl = {
            block: 'block',
            mods: {
                m1: ['v1', 'v2']
            }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: null },
            { entity: { block: 'block', modName: 'm1', modVal: 'v2' }, tech: null }
        ]);
    });

    it('should support array of mod values', () => {
        const decl = {
            block: 'block',
            mods: ['m1', 'm2']
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'm2', modVal: true }, tech: null }
        ]);
    });
});
