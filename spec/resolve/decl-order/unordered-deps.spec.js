'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../../lib/utils').findIndex;

test('should keep the ordering described in decl', () => {
    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];
    const deps = [];
    const resolved = resolve(decl, deps);
    const indexA = findIndex(resolved.entities, { block: 'A' });
    const indexB = findIndex(resolved.entities, { block: 'B' });

    expect(indexA).to.be.below(indexB);
});

test('should place entities described in decl before their dependencies', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [{ entity: { block: 'B' } }]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexA = findIndex(resolved.entities, { block: 'A' });
    const indexB = findIndex(resolved.entities, { block: 'B' });

    expect(indexB).to.be.above(indexA);
});

test('should not change decl order because of deps order', () => {
    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];
    const deps = [
        {
            entity: { block: 'B' },
            dependOn: [{ entity: { block: 'C' } }]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexA = findIndex(resolved.entities, { block: 'A' });
    const indexB = findIndex(resolved.entities, { block: 'B' });

    expect(indexA).to.be.below(indexB);
});
