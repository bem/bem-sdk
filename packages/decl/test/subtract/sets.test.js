'use strict';

const test = require('ava');
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');
const createCell = (cell) => new BemCell({
    entity: new BemEntityName(cell.entity),
    tech: cell.tech
});

const subtract = require('../../lib/subtract');

test('should subtract set from empty set', t => {
    const A = [{ entity: { block: 'A' } }].map(createCell);

    t.deepEqual(subtract([], A), []);
});

test('should subtract empty set from set', t => {
    const A = [{ entity: { block: 'A' } }].map(createCell);

    t.deepEqual(subtract(A, []), A);
});

test('should support disjoint sets', t => {
    const A = [{ entity: { block: 'A' } }].map(createCell);
    const B = [{ entity: { block: 'B' } }].map(createCell);

    t.deepEqual(subtract(A, B), A);
});

test('should support intersecting sets', t => {
    const ABC = [{ entity: { block: 'A' } }, { entity: { block: 'B' } }, { entity: { block: 'C' } }].map(createCell);
    const B   = [{ entity: { block: 'B' } }].map(createCell);
    const AC  = [{ entity: { block: 'A' } }, { entity: { block: 'C' } }].map(createCell);

    t.deepEqual(subtract(ABC, B).map(c => c.id), AC.map(c => c.id));
});

test('should support several decls', t => {
    const A = createCell({ entity: { block: 'A' } });
    const B = createCell({ entity: { block: 'B' } });
    const C = createCell({ entity: { block: 'C' } });

    t.deepEqual(subtract([A, B, C], [B], [C]), [A]);
});
