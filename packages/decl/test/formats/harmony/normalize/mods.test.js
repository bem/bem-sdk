'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../../../util').simplifyCell;
const normalize = require('../../../../lib/formats/harmony/normalize');

describe('normalize-harmony.mods', () => {
    it('should support shortcut for bool mod', () => {
        const decl = { block: 'block', modName: 'mod' };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null }
        ]);
    });

    it('should support bool mod', () => {
        const decl = { block: 'block', modName: 'mod', modVal: true };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null }
        ]);
    });

    it('should support mod', () => {
        const decl = { block: 'block', modName: 'mod', modVal: 'val' };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null }
        ]);
    });

    it('should support mods as objects', () => {
        const decl = {
            block: 'block',
            mods: { mod: 'val' }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null }
        ]);
    });

    it('should support bool mods as array', () => {
        const decl = {
            block: 'block',
            mods: ['mod-1', 'mod-2']
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod-1', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'mod-2', modVal: true }, tech: null }
        ]);
    });

    it('should support mod values as array', () => {
        const decl = {
            block: 'block',
            mods: { mod: ['val-1', 'val-2'] }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val-1' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val-2' }, tech: null }
        ]);
    });
});
