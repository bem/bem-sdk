'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../../lib/utils').findIndex;

test('should keep the ordering described in deps', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'B' },
                    order: 'dependenceBeforeDependants'
                },
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexB = findIndex(resolved.entities, { block: 'B' });
    const indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexB).to.be.below(indexC);
});

test('should keep ordering for transitive dependencies', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'B' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        },
        {
            entity: { block: 'B' },
            dependOn: [
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants'
                },
                {
                    entity: { block: 'D' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexC = findIndex(resolved.entities, { block: 'C' });
    const indexD = findIndex(resolved.entities, { block: 'D' });

    expect(indexC).to.be.below(indexD);
});

test('should keep deps ordering if dependencies are unaffected by other ordering', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                { entity: { block: 'B' } },
                { entity: { block: 'C' } }
            ]
        },
        {
            entity: { block: 'B' },
            dependOn: [
                {
                    entity: { block: 'D' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        },
        {
            entity: { block: 'C' },
            dependOn: [
                {
                    entity: { block: 'D' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexB = findIndex(resolved.entities, { block: 'B' });
    const indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexB).to.be.below(indexC);
});

test('should keep deps ordering if dependencies are unaffected by explicit ordering', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                { entity: { block: 'B' } },
                { entity: { block: 'C' } },
                { entity: { block: 'D' } }
            ]
        },
        {
            entity: { block: 'B' },
            dependOn: [
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexB = findIndex(resolved.entities, { block: 'B' });
    const indexD = findIndex(resolved.entities, { block: 'D' });

    expect(indexB).to.be.below(indexD);
});
