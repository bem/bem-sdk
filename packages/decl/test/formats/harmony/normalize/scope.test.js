'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../../../util').simplifyCell;
const normalize = require('../../../../lib/formats/harmony/normalize');

describe('normalize-harmony.scope', () => {
    it('should support mod in block scope', () => {
        const decl = {
            scope: 'block',
            modName: 'mod',
            modVal: 'val'
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null }
        ]);
    });

    it('should support mods in block scope', () => {
        const decl = {
            scope: 'block',
            mods: { mod: 'val' }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null }
        ]);
    });

    it('should support elem in block scope', () => {
        const decl = {
            scope: 'block',
            elem: 'elem'
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem' }, tech: null }
        ]);
    });

    it('should support elems in block scope', () => {
        const decl = {
            scope: 'block',
            elems: ['elem-1', 'elem-2']
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem-1' }, tech: null },
            { entity: { block: 'block', elem: 'elem-2' }, tech: null }
        ]);
    });

    it('should support elem mod in block scope', () => {
        const decl = {
            scope: 'block',
            elem: 'elem', modName: 'mod', modVal: 'val'
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ]);
    });

    it('should support mod in elem scope', () => {
        const decl = {
            scope: { block: 'block', elem: 'elem' },
            modName: 'mod', modVal: 'val'
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ]);
    });

    it('should support mix in elem scope', () => {
        const decl = {
            scope: 'block',
            elems: ['elem-1', 'elem-2'],
            mods: ['mod-1', 'mod-2']
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem-1' }, tech: null },
            { entity: { block: 'block', elem: 'elem-2' }, tech: null },
            { entity: { block: 'block', modName: 'mod-1', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'mod-2', modVal: true }, tech: null }
        ]);
    });
});
