'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../../../util').simplifyCell;
const normalize = require('../../../../lib/formats/v2/normalize');

describe('normalize2.elems-mod', () => {
    it('should support shortcut for bool mod of elem', () => {
        const decl = { block: 'block', elems: 'elem', mod: 'mod' };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null }
        ]);
    });

    it('should support bool mod of elems', () => {
        const decl = { block: 'block', elems: 'elem', mod: 'mod', val: true };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null }
        ]);
    });

    it('should remove bool mod on elem if falsy except 0', () => {
        const decl = [
            { block: 'block', elems: 'elem', mod: 'mod', val: false },
            { block: 'block', elems: 'elem', mod: 'mod', val: undefined },
            { block: 'block', elems: 'elem', mod: 'mod', val: null }
        ];

        const expected = [
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null }
        ];

        decl.forEach(item => {
            expect(normalize(item).map(simplifyCell)).to.deep.equal(expected);
        });
    });
});
