'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../../lib/utils').findIndex;
const findLastIndex = require('../../../lib/utils').findLastIndex;

test('should resolve entity depending by tech on another entity', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [{
                    entity: { block: 'B' },
                    tech: 'css',
                    order: 'dependenceBeforeDependants'
                }]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'B' });
});

test('should resolve entity depending by tech on multiple entities', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'B' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    },
                    {
                        entity: { block: 'C' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'B' })
        .and.to.contain({ block: 'C' });
});

test('should resolve entity depending by multiple techs on another entity', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'B' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    },
                    {
                        entity: { block: 'B' },
                        tech: 'js',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'B' });
});

test('should resolve dependency depending by tech on another entity', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    { entity: { block: 'B' } }
                ]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    {
                        entity: { block: 'C' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'C' });
});

test('should resolve dependency depending by multiple techs on another entity', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    { entity: { block: 'B' } }
                ]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    {
                        entity: { block: 'C' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    },
                    {
                        entity: { block: 'C' },
                        tech: 'js',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'C' });
});

test('should resolve dependency depending by tech on another entities', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    { entity: { block: 'B' } }
                ]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    {
                        entity: { block: 'C' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    },
                    {
                        entity: { block: 'D' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'C' })
        .and.to.contain({ block: 'D' });
});

test('should include tech dependency to result once if multiple entities depend on this entity', () => {
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
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    {
                        entity: { block: 'C' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts),
        firstIndex = findIndex(resolved.entities, { block: 'C' }),
        lastIndex = findLastIndex(resolved.entities, { block: 'C' });

    expect(resolved.entities).to.contain({ block: 'C' });
    expect(firstIndex).to.be.equal(lastIndex);
});

test('should not include entity if no entity from decl depends on it and this entity has tech dependency on' +
    ' entity listed in decl', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'B' },
                dependOn: [
                    {
                        entity: { block: 'A' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).not.to.contain({ block: 'B' });
});

test('should not include dependencie\'s dependency if no entity from decl\'s dependencies depends ' +
    'on it', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'C' },
                dependOn: [
                    {
                        entity: { block: 'D' },
                        tech: 'css',
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.not.contain({ block: 'D' });
});
