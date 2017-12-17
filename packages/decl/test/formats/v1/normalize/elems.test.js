'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../../../util').simplifyCell;
const normalize = require('../../../../lib/formats/v1/normalize');

describe('intersect.elems', () => {
    it('should support arrays', () => {
        const decl = {
            name: 'block',
            elems: [
                { name: 'elem-1' },
                { name: 'elem-2' }
            ]
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem-1' }, tech: null },
            { entity: { block: 'block', elem: 'elem-2' }, tech: null }
        ]);
    });

    it('should support objects', () => {
        const decl = {
            name: 'block',
            elems: [
                { name: 'elem', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] }
            ]
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ]);
    });

    it('should support mod shortcut', () => {
        const decl = {
            name: 'block',
            elems: [
                { name: 'elem', mods: [{ name: 'mod' }] }
            ]
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null }
        ]);
    });
});
