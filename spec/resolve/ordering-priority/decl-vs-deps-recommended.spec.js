'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../../lib/utils').findIndex;

test.failing('should prioritise decl order over recommended deps order', () => {
    const decl = [
        { block: 'A' },
        { block: 'C' },
        { block: 'B' }
    ];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                { entity: { block: 'B' } },
                { entity: { block: 'C' } }
            ]
        }
    ];

    const resolved = resolve(decl, deps);
    const indexB = findIndex(resolved.entities, { block: 'B' });
    const indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexC).to.be.below(indexB);
});

test('should save user order for unordered dependencies', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                { entity: { block: 'B' } },
                { entity: { block: 'C' } }
            ]
        }
    ];

    const resolved = resolve(decl, deps);
    const indexA = findIndex(resolved.entities, { block: 'A' });
    const indexB = findIndex(resolved.entities, { block: 'B' });
    const indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexA).to.be.below(indexB)
        .and.to.be.below(indexC);
});

test('should save decl order when resolve ordered and unordered deps of another dependency', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants'
                },
                {
                    entity: { block: 'D' }
                }
            ]
        }
    ];

    const resolved = resolve(decl, deps);

    const indexC = findIndex(resolved.entities, { block: 'C' });
    const indexD = findIndex(resolved.entities, { block: 'D' });

    expect(indexC).to.be.below(indexD);
});
