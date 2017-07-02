'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemCell = require('@bem/sdk.cell');
const createCell = BemCell.create;

const subtract = require('../../lib/subtract');

describe('subtract.sets', () => {
    it('should subtract set from empty set', () => {
        const A = [{ entity: { block: 'A' } }].map(createCell);

        expect(subtract([], A)).to.deep.equal([]);
    });

    it('should subtract empty set from set', () => {
        const A = [{ entity: { block: 'A' } }].map(createCell);

        expect(subtract(A, [])).to.deep.equal(A);
    });

    it('should support disjoint sets', () => {
        const A = [{ entity: { block: 'A' } }].map(createCell);
        const B = [{ entity: { block: 'B' } }].map(createCell);

        expect(subtract(A, B)).to.deep.equal(A);
    });

    it('should support intersecting sets', () => {
        const ABC = [{ entity: { block: 'A' } }, { entity: { block: 'B' } },
            { entity: { block: 'C' } }].map(createCell);
        const B = [{ entity: { block: 'B' } }].map(createCell);
        const AC = [{ entity: { block: 'A' } }, { entity: { block: 'C' } }].map(createCell);

        expect(subtract(ABC, B).map(c => c.id)).to.deep.equal(AC.map(c => c.id));
    });

    it('should support several decls', () => {
        const A = createCell({ entity: { block: 'A' } });
        const B = createCell({ entity: { block: 'B' } });
        const C = createCell({ entity: { block: 'C' } });

        expect(subtract([A,B,C], [B], [C])).to.deep.equal([A]);
    });

});
