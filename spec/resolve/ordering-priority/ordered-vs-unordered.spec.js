'use strict';

const test = require('ava');
const expect = require('chai').expect;

const resolve = require('../../../lib').resolve;
const findIndex = require('../../../lib/utils').findIndex;

test('should prioritise ordered dependency over decl recommended ordering', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'B' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        resolved = resolve(decl, deps),
        indexA = findIndex(resolved.entities, { block: 'A' }),
        indexB = findIndex(resolved.entities, { block: 'B' });

    expect(indexB).to.be.below(indexA);
});

test('should prioritise ordered dependency over deps recommended ordering', () => {
    var decl = [
            { block: 'A' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'B' }
                    },
                    {
                        entity: { block: 'C' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        resolved = resolve(decl, deps),
        indexB = findIndex(resolved.entities, { block: 'B' }),
        indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexC).to.be.below(indexB);
});

test('should resolve ordered dependencies independently of unordered dependency of declaration entity', () => {
    const decl = [
        { block: 'A' },
    ];
    const relations = [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'B' }
                },
                {
                    entity: { block: 'C' }
                }
            ]
        },
        {
            entity: { block: 'C' },
            dependOn: [{
                entity: { block: 'D' },
                order: 'dependenceBeforeDependants'
            }]
        }
    ];

    const resolved = resolve(decl, relations);

    expect(resolved.entities).to.deep.equal([
        { block: 'A' },
        { block: 'B' },

        { block: 'D' },
        { block: 'C' }
    ]);
});
