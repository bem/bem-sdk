'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemCell = require('@bem/sdk.cell');
const createCell = BemCell.create;

const merge = require('../../lib/merge');

describe('intersect.sets', () => {
    it('should support only one decl', () => {
        const decl = [{ entity: { block: 'block' } }].map(createCell);

        expect(merge(decl)).to.deep.equal(decl);
    });

    it('should support several decls', () => {
        const A = createCell({ entity: { block: 'A' } });
        const B = createCell({ entity: { block: 'B' } });
        const C = createCell({ entity: { block: 'C' } });

        expect(merge(merge([A], [B], [C]))).to.deep.equal([A, B, C]);
    });

    it('should support many decls', () => {
        const A = createCell({ entity: { block: 'A' } });
        const B = createCell({ entity: { block: 'B' } });
        const C = createCell({ entity: { block: 'C' } });

        expect(merge(merge([A], [B], [A, B], [B, C], [A, C]))).to.deep.equal([A, B, C]);
    });

    it('should return set', () => {
        const decl = [{ entity: { block: 'block' } }].map(createCell);

        expect(merge(merge(decl, decl))).to.deep.equal(decl);
    });

    it('should merge set with empty set', () => {
        const decl = [{ entity: { block: 'block' } }].map(createCell);

        expect(merge(merge(decl, []))).to.deep.equal(decl);
    });

    it('should merge disjoint sets', () => {
        const A = [{ entity: { block: 'A' } }].map(createCell);
        const B = [{ entity: { block: 'B' } }].map(createCell);

        expect(merge(merge(A, B))).to.deep.equal([].concat(A, B));
    });

    it('should merge intersecting sets', () => {
        const ABC = [{ entity: { block: 'A' } }, { entity: { block: 'B' } },
            { entity: { block: 'C' } }].map(createCell);
        const B = [{ entity: { block: 'B' } }].map(createCell);

        expect(merge(merge(ABC, B))).to.deep.equal(ABC);
    });
});
