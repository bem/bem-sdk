'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../../lib/utils').findIndex;
const findLastIndex = require('../../../lib/utils').findLastIndex;

test('should resolve entity depending on another entity', () => {
    var decl = [{ block: 'A' }],
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
        resolved = resolve(decl, deps);

    expect(resolved.entities).to.contain({ block: 'B' });
});

test('should resolve entity depending on multiple ordered entities', () => {
    var decl = [{ block: 'A' }],
        deps = [
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
        ],
        resolved = resolve(decl, deps);

    expect(resolved.entities).to.contain({ block: 'B' })
        .and.to.contain({ block: 'C' });
});

test('should resolve entity depending on ordered and unordered entities', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'B' },
                        order: 'dependenceBeforeDependants'
                    },
                    {
                        entity: { block: 'C' }
                    }
                ]
            }
        ],
        resolved = resolve(decl, deps);

    expect(resolved.entities).to.contain({ block: 'B' })
        .and.to.contain({ block: 'C' });
});

test('should include entity once if entity depends on itself', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'A' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        resolved = resolve(decl, deps);

    expect(resolved.entities).to.be.eql([{ block: 'A' }]);
});

test('should resolve dependency depending on another entity', () => {
    var decl = [{ block: 'A' }],
        deps = [
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
                    }
                ]
            }
        ],
        resolved = resolve(decl, deps);

    expect(resolved.entities).to.contain({ block: 'C' });
});

test('should allow dependency to depend on another multiple entities', () => {
    var decl = [{ block: 'A' }],
        deps = [
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
        ],
        resolved = resolve(decl, deps);

    expect(resolved.entities).to.contain({ block: 'C' })
        .and.to.contain({ block: 'D' });
});

test('should include entity once if multiple entities depend on this entity', () => {
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
        firstIndex = findIndex(resolved.entities, { block: 'C' }),
        lastIndex = findLastIndex(resolved.entities, { block: 'C' });

    expect(resolved.entities).to.contain({ block: 'C' });
    expect(firstIndex).to.be.equal(lastIndex);
});

test('should not include entity if no entity from decl depends on it and this entity has dependency on entity' +
    ' listed in decl', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'B' },
                dependOn: [
                    {
                        entity: { block: 'A' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        resolved = resolve(decl, deps);

    expect(resolved.entities).not.to.contain({ block: 'B' });
});

test('should not include dependency of dependency if no entity from decl\'s dependencies depends ' +
    'on it', () => {
    var decl = [{ block: 'A' }],
        deps = [
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
        resolved = resolve(decl, deps);

    expect(resolved.entities).to.not.contain({ block: 'D' });
});
