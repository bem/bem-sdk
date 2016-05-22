'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../../lib/utils').findIndex;

test('should place ordered entity from decl before entity depending on it', () => {
    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'B' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexA = findIndex(resolved.entities, { block: 'A' });
    const indexB = findIndex(resolved.entities, { block: 'B' });

    expect(indexB).to.be.below(indexA);
});

test('should place ordered entity from decl before several entities depending on it', () => {
    const decl = [
        { block: 'A' },
        { block: 'B' },
        { block: 'C' }
    ];
    const deps = [
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
    ];
    const resolved = resolve(decl, deps);
    const indexA = findIndex(resolved.entities, { block: 'A' });
    const indexB = findIndex(resolved.entities, { block: 'B' });
    const indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexC).to.be.below(indexA)
        .and.to.be.below(indexB);
});

test('should place ordered dependency before entity from decl depending on it', () => {
    const  decl = [
        { block: 'A' }
    ];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'B' },
                    order: 'dependenceBeforeDependants'
                }

            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexA = findIndex(resolved.entities, { block: 'A' });
    const indexB = findIndex(resolved.entities, { block: 'B' });

    expect(indexB).to.be.below(indexA);
});

test('should place ordered dependency before multiple entities from decl depending on it', () => {
    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];
    const deps = [
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
    ];
    const resolved = resolve(decl, deps);
    const indexA = findIndex(resolved.entities, { block: 'A' });
    const indexB = findIndex(resolved.entities, { block: 'B' });
    const indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexC).to.be.below(indexA)
        .and.to.be.below(indexB);
});

test('should keep decl ordering for entities unaffected by ordered dependency', () => {
    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexA = findIndex(resolved.entities, { block: 'A' });
    const indexB = findIndex(resolved.entities, { block: 'B' });

    expect(indexA).to.be.below(indexB);
});

test('should place ordered dependency before dependency depending on it', () => {
    const decl = [
        { block: 'A' }
    ];
    const deps = [
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
    ];
    const resolved = resolve(decl, deps);
    const indexB = findIndex(resolved.entities, { block: 'B' });
    const indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexC).to.be.below(indexB);
});

test('should place ordered dependency before several dependencies depending on it', () => {
    const decl = [
        { block: 'A' }
    ];
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
    const indexD = findIndex(resolved.entities, { block: 'D' });

    expect(indexD).to.be.below(indexB)
        .and.to.be.below(indexC);
});

test('should place ordered dependency before entity from decl and another dependency if they depend on ' +
    'it', () => {
    const decl = [
        { block: 'A' }
    ];
    const deps = [
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
    ];
    const resolved = resolve(decl, deps);
    const indexA = findIndex(resolved.entities, { block: 'A' });
    const indexB = findIndex(resolved.entities, { block: 'B' });
    const indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexC).to.be.below(indexA)
        .and.to.be.below(indexB);
});
