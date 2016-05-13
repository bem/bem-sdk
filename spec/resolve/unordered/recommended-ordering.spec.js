'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../utils').findIndex;

test('should keep the ordering described in decl', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [],
        resolved = resolve(decl, deps),
        indexA = findIndex(resolved.entities, { block: 'A' }),
        indexB = findIndex(resolved.entities, { block: 'B' });

    expect(indexA).to.be.below(indexB);
});

test('should place entities described in decl before dependencies', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [{ entity: { block: 'B' } }]
            }
        ],
        resolved = resolve(decl, deps),
        indexA = findIndex(resolved.entities, { block: 'A' }),
        indexB = findIndex(resolved.entities, { block: 'B' });

    expect(indexB).to.be.above(indexA);
});

test('should keep the ordering described in deps', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    { entity: { block: 'B' } },
                    { entity: { block: 'C' } }
                ]
            }
        ],
        resolved = resolve(decl, deps),
        indexB = findIndex(resolved.entities, { block: 'B' }),
        indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexB).to.be.below(indexC);
});

test('should not change decl order because of deps order', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
            {
                entity: { block: 'B' },
                dependOn: [{ entity: { block: 'C' } }]
            }
        ],
        resolved = resolve(decl, deps),
        indexA = findIndex(resolved.entities, { block: 'A' }),
        indexB = findIndex(resolved.entities, { block: 'B' });

    expect(indexA).to.be.below(indexB);
});

test('should place dependency of dependency after entities from decl', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [{ entity: { block: 'B' } }]
            },
            {
                entity: { block: 'B' },
                dependOn: [{ entity: { block: 'C' } }]
            }
        ],
        resolved = resolve(decl, deps),
        indexA = findIndex(resolved.entities, { block: 'A' }),
        indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexA).to.be.below(indexC);
});

test('should keep ordering for dependencies of dependency', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [{ entity: { block: 'B' } }]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    { entity: { block: 'C' } },
                    { entity: { block: 'D' } }
                ]
            }
        ],
        resolved = resolve(decl, deps),
        indexC = findIndex(resolved.entities, { block: 'C' }),
        indexD = findIndex(resolved.entities, { block: 'D' });

    expect(indexC).to.be.below(indexD);
});
