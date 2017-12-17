'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const createCell = require('../../../util').createCell;
const simplifyCell = require('../../../util').simplifyCell;
const normalize = require('../../../../lib/formats/v2/normalize');

describe('normalize2.mod-mods-vals', () => {
    it('should support mod and mods with scope block, elem', () => {
        const scope = createCell({ entity: { block: 'sb' } });
        const decl = [
            { mod: 'mod', val: 'val' },
            { mods: { mod1: 'val1' } }
        ];

        expect(normalize(decl, scope).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'sb', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'sb', modName: 'mod', modVal: 'val' }, tech: null },
            { entity: { block: 'sb' }, tech: null },
            { entity: { block: 'sb', modName: 'mod1', modVal: true }, tech: null },
            { entity: { block: 'sb', modName: 'mod1', modVal: 'val1' }, tech: null }
        ]);
    });

    it('should support mod without block & elem but with scope', () => {
        const scope = createCell({ entity: { block: 'sb' } });
        const decl = { mod: 'mod', val: 'val' };

        expect(normalize(decl, scope).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'sb', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'sb', modName: 'mod', modVal: 'val' }, tech: null }
        ]);
    });

    it('should support mods without block & elem', () => {
        const scope = createCell({ entity: { block: 'sb' } });
        const decl = { mods: { mod: 'val' } };

        expect(normalize(decl, scope).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'sb' }, tech: null },
            { entity: { block: 'sb', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'sb', modName: 'mod', modVal: 'val' }, tech: null }
        ]);
    });

    it('should support only vals', () => {
        const scope = createCell({ entity: { block: 'sb', modName: 'sm' } });
        const decl = { val: 'val' };

        expect(normalize(decl, scope).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'sb', modName: 'sm', modVal: true }, tech: null },
            { entity: { block: 'sb', modName: 'sm', modVal: 'val' }, tech: null }
        ]);
    });
});
