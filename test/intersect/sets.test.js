'use strict';

const test = require('ava');
const createCell = require('../util').createCell;
const intersect = require('../../lib/intersect');

test('should support only one decl', t => {
    const decl = [{ entity: { block: 'block' }, tech: null }].map(createCell);

    t.deepEqual(intersect(decl), decl);
});

test('should support several decls', t => {
    const block = [{ entity: { block: 'block' }, tech: null }].map(createCell);

    t.deepEqual(intersect(block, block, block, block), block);
});

test('should intersect set with empty set', t => {
    const decl = [{ entity: { block: 'block' }, tech: null }].map(createCell);

    t.deepEqual(intersect(decl, []), []);
});

test('should intersect disjoint sets', t => {
    const A = [{ entity: { block: 'A' }, tech: null }].map(createCell);
    const B = [{ entity: { block: 'B' }, tech: null }].map(createCell);

    t.deepEqual(intersect(A, B), []);
});

test('should intersect intersecting sets', t => {
    const ABC = [
        { entity: { block: 'A' }, tech: null },
        { entity: { block: 'B' }, tech: null },
        { entity: { block: 'C' }, tech: null }
    ].map(createCell);
    const B = [{ entity: { block: 'B' }, tech: null }].map(createCell);

    t.deepEqual(intersect(ABC, B), B);
});

test('should intersect intersecting sets with different techs', t => {
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

    t.deepEqual(intersect(ABC, B).map(c => c.id), [common.id]);
});

test('should intersect 3 sets', t => {
    const common = createCell({ entity: { block: 'COMMON' }, tech: 'common' });
    const ABC = [
        { entity: { block: 'A' }, tech: null },
        { entity: { block: 'B' }, tech: 't1' },
        common
    ].map(createCell);
    const A = [{ entity: { block: 'A' }, tech: null }, common].map(createCell);
    const B = [{ entity: { block: 'B' }, tech: null }, common].map(createCell);

    t.deepEqual(intersect(ABC, A, B).map(c => c.id), [common.id]);
});
