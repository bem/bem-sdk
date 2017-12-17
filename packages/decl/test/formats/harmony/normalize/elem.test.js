'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../../../util').simplifyCell;
const normalize = require('../../../../lib/formats/harmony/normalize');

describe('normalize-harmony.elem', () => {
    it('should support elem', () => {
        const decl = { block: 'block', elem: 'elem' };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null }
        ]);
    });

    it('should support shortcut for bool mod of elem', () => {
        const decl = { block: 'block', elem: 'elem', modName: 'mod' };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null }
        ]);
    });

    it('should support bool mod of elem', () => {
        const decl = { block: 'block', elem: 'elem', modName: 'mod', modVal: true };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null }
        ]);
    });

    it('should support elem mod', () => {
        const decl = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ]);
    });

    it('should support elem mods as object', () => {
        const decl = {
            block: 'block',
            elem: 'elem',
            mods: { mod: 'val' }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ]);
    });

    it('should support bool mods of elem as array', () => {
        const decl = {
            block: 'block',
            elem: 'elem',
            mods: ['mod-1', 'mod-2']
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod-1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod-2', modVal: true }, tech: null }
        ]);
    });

    it('should support mod values of elem as array', () => {
        const decl = {
            block: 'block',
            elem: 'elem',
            mods: { mod: ['val-1', 'val-2'] }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-1' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-2' }, tech: null }
        ]);
    });
});
