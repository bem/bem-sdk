'use strict';

const test = require('ava');
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');
const createCell = (cell) => new BemCell({
    entity: new BemEntityName(cell.entity),
    tech: cell.tech
});

const merge = require('../../lib/merge');

test('should support only one decl', t => {
    const decl = [{ entity: { block: 'block' } }].map(createCell);

    t.deepEqual(merge(decl), decl);
});

test('should support several decls', t => {
    const A = createCell({ entity: { block: 'A' } });
    const B = createCell({ entity: { block: 'B' } });
    const C = createCell({ entity: { block: 'C' } });

    t.deepEqual(merge([A], [B], [C]), [A, B, C]);
});

test('should support many decls', t => {
    const A = createCell({ entity: { block: 'A' } });
    const B = createCell({ entity: { block: 'B' } });
    const C = createCell({ entity: { block: 'C' } });

    t.deepEqual(merge([A], [B], [A, B], [B, C], [A, C]), [A, B, C]);
});

test('should return set', t => {
    const decl = [{ entity: { block: 'block' } }].map(createCell);

    t.deepEqual(merge(decl, decl), decl);
});

test('should merge set with empty set', t => {
    const decl = [{ entity: { block: 'block' } }].map(createCell);

    t.deepEqual(merge(decl, []), decl);
});

test('should merge disjoint sets', t => {
    const A = [{ entity: { block: 'A' } }].map(createCell);
    const B = [{ entity: { block: 'B' } }].map(createCell);

    t.deepEqual(merge(A, B), [].concat(A, B));
});

test('should merge intersecting sets', t => {
    const ABC = [{ entity: { block: 'A' } }, { entity: { block: 'B' } }, { entity: { block: 'C' } }].map(createCell);
    const B = [{ entity: { block: 'B' } }].map(createCell);

    t.deepEqual(merge(ABC, B), ABC);
});
