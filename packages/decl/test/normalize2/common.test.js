'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

describe('normalize2.common', () => {
    it('should support undefined', () => {
        expect(normalize()).to.deep.equal([]);
    });

    it('should support empty array', () => {
        expect(normalize([])).to.deep.equal([]);
    });

    it('should support empty object in array', () => {
        expect(normalize([{}], { entity: { block: 'sb' } }).map(simplifyCell)).to.deep.equal(
            [{ entity: { block: 'sb' }, tech: null }]
        );
    });

    it('should support empty object with scope', () => {
        expect(normalize({}, { entity: { block: 'sb' } }).map(simplifyCell)).to.deep.equal(
            [{ entity: { block: 'sb' }, tech: null }]
        );
    });

    it('should return set', () => {
        const A = { block: 'A' };

        expect(normalize([A, A]).map(simplifyCell)).to.deep.equal([{ entity: A, tech: null }]);
    });

    it('should save order', () => {
        const A = { block: 'A' },
            B = { block: 'B' };

        expect(normalize([A, B, A]).map(simplifyCell)).to.deep.equal([
            { entity: A, tech: null },
            { entity: B, tech: null }
        ]);
    });

    it('should support array', () => {
        const decl = [
            { block: 'A' },
            { block: 'B' }
        ];

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'A' }, tech: null },
            { entity: { block: 'B' }, tech: null }
        ]);
    });
});
