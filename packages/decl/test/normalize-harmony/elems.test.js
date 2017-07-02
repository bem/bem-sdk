'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/harmony');

describe('normalize-harmony.elems', () => {
    it('should support strings', () => {
        const decl = {
            block: 'block',
            elems: ['elem-1', 'elem-2']
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem-1' }, tech: null },
            { entity: { block: 'block', elem: 'elem-2' }, tech: null }
        ]);
    });

    it('should support objects', () => {
        const decl = {
            block: 'block',
            elems: [{ elem: 'elem' }]
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null }
        ]);
    });

    it('should support mods for elem objects', () => {
        const decl = {
            block: 'block',
            elems: [{ elem: 'elem', mods: { mod: 'val' } }]
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ]);
    });
});
