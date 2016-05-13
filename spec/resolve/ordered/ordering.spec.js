'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../utils').findIndex;

test('should place ordered entity from decl before entity depending on it', () => {
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

test('should place ordered entity from decl before several entities depending on it', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' },
            { block: 'C' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'C' },
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
                    }
                ]
            }
        ],
        resolved = resolve(decl, deps),
        indexA = findIndex(resolved.entities, { block: 'A' }),
        indexB = findIndex(resolved.entities, { block: 'B' }),
        indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexC).to.be.below(indexA)
        .and.to.be.below(indexB);
});

test('should keep decl ordering for entities unaffected by ordering', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' },
            { block: 'C' }
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
        indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexA).to.be.below(indexC);
});

test('should place ordered dependency before entity from decl depending on it', () => {
    var decl = [
            { block: 'A' }
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

test('should place ordered dependency before multiple entities from decl depending on it', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'C' },
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
                    }
                ]
            }
        ],
        resolved = resolve(decl, deps),
        indexA = findIndex(resolved.entities, { block: 'A' }),
        indexB = findIndex(resolved.entities, { block: 'B' }),
        indexC = findIndex(resolved.entities, { block: 'C' });

        expect(indexC).to.be.below(indexA)
            .and.to.be.below(indexB);
});

test('should keep decl ordering for entities unaffected by ordered dependency', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'C' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        resolved = resolve(decl, deps),
        indexA = findIndex(resolved.entities, { block: 'A' }),
        indexB = findIndex(resolved.entities, { block: 'B' });

    expect(indexA).to.be.below(indexB);
});

test('should place ordered dependency before dependency depending on it', () => {
    var decl = [
            { block: 'A' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'B' }
                    }
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
        ],
        resolved = resolve(decl, deps),
        indexB = findIndex(resolved.entities, { block: 'B' }),
        indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexC).to.be.below(indexB);
});

test('should place ordered dependency before several dependencies depending on it', () => {
    var decl = [
            { block: 'A' }
        ],
        deps = [
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
        ],
        resolved = resolve(decl, deps),
        indexB = findIndex(resolved.entities, { block: 'B' }),
        indexC = findIndex(resolved.entities, { block: 'C' }),
        indexD = findIndex(resolved.entities, { block: 'D' });

    expect(indexD).to.be.below(indexB)
        .and.to.be.below(indexC);
});

test('should keep ordering for dependencies unaffected by explicit ordering', () => {
    var decl = [
            { block: 'A' }
        ],
        deps = [
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
        ],
        resolved = resolve(decl, deps),
        indexB = findIndex(resolved.entities, { block: 'B' }),
        indexD = findIndex(resolved.entities, { block: 'D' });

    expect(indexB).to.be.below(indexD);
});

test('should place ordered dependency before entity from decl and another dependency if they depend on ' +
    'it', () => {
    var decl = [
            { block: 'A' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    { entity: { block: 'B' } },
                    {
                        entity: { block: 'C' },
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
                    }

                ]
            }
        ],
        resolved = resolve(decl, deps),
        indexA = findIndex(resolved.entities, { block: 'A' }),
        indexB = findIndex(resolved.entities, { block: 'B' }),
        indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexC).to.be.below(indexA)
        .and.to.be.below(indexB);
});
