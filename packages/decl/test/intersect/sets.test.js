'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const createCell = require('../util').createCell;
const intersect = require('../../lib/intersect');

describe('intersect.sets', () => {
    it('should support only one decl', () => {
        const decl = [{ entity: { block: 'block' }, tech: null }].map(createCell);

        expect(intersect(decl)).to.deep.equal(decl);
    });

    it('should support several decls', () => {
        const block = [{ entity: { block: 'block' }, tech: null }].map(createCell);

        expect(intersect(block, block, block, block)).to.deep.equal(block);
    });

    it('should intersect set with empty set', () => {
        const decl = [{ entity: { block: 'block' }, tech: null }].map(createCell);

        expect(intersect(decl, [])).to.deep.equal([]);
    });

    it('should intersect disjoint sets', () => {
        const A = [{ entity: { block: 'A' }, tech: null }].map(createCell);
        const B = [{ entity: { block: 'B' }, tech: null }].map(createCell);

        expect(intersect(A, B)).to.deep.equal([]);
    });

    it('should intersect intersecting sets', () => {
        const ABC = [
            { entity: { block: 'A' }, tech: null },
            { entity: { block: 'B' }, tech: null },
            { entity: { block: 'C' }, tech: null }
        ].map(createCell);
        const B = [{ entity: { block: 'B' }, tech: null }].map(createCell);

        expect(intersect(ABC, B)).to.deep.equal(B);
    });

    it('should intersect intersecting sets with different techs', () => {
        const common = createCell({ entity: { block: 'C' }, tech: 't1' });
        const ABC = [
            { entity: { block: 'A' }, tech: null },
            { entity: { block: 'B' }, tech: 't1' },
            common
        ].map(createCell);
        const B = [
            { entity: { block: 'B' }, tech: 't2' },
            common
        ].map(createCell);

        expect(intersect(ABC, B).map(c => c.id)).to.deep.equal([common.id]);
    });

    it('should intersect 3 sets', () => {
        const common = createCell({ entity: { block: 'COMMON' }, tech: 'common' });
        const ABC = [
            { entity: { block: 'A' }, tech: null },
            { entity: { block: 'B' }, tech: 't1' },
            common
        ].map(createCell);
        const A = [{ entity: { block: 'A' }, tech: null }, common].map(createCell);
        const B = [{ entity: { block: 'B' }, tech: null }, common].map(createCell);

        expect(intersect(ABC, A, B).map(c => c.id)).to.deep.equal([common.id]);
    });
});
