'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../../lib').resolve;

test('should resolve transitive dependency', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'B' },
                    order: 'dependenceBeforeDependants',
                    tech: 'js'
                }
            ]
        },
        {
            entity: { block: 'B' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants',
                    tech: 'js'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps, { tech: 'css' });

    expect(resolved.dependOn).to.contain({
        entities: [{ block: 'B' }, { block: 'C' }],
        tech: 'js'
    });
});

test('should resolve transitive depending on multiple dependencies', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'B' },
                    order: 'dependenceBeforeDependants',
                    tech: 'js'
                }
            ]
        },
        {
            entity: { block: 'B' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants',
                    tech: 'js'
                },
                {
                    entity: { block: 'D' },
                    order: 'dependenceBeforeDependants',
                    tech: 'js'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps, { tech: 'css' });

    expect(resolved.dependOn).to.contain({
        entities: [{ block: 'B' }, { block: 'C' }, { block: 'D' }],
        tech: 'js'
    });
});

test('should resolve transitive depending by multiple techs on another entity', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'B' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        },
        {
            entity: { block: 'B' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants',
                    tech: 'css'
                },
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants',
                    tech: 'js'
                }
            ]
        }
    ];
    const opts = { tech: 'css' };
    const resolved = resolve(decl, deps, opts);

    expect(resolved.dependOn).to.contain({
        entities: [{ block: 'C' }],
        tech: 'js'
    });
});

test('should resolve multiple tech dependencies depending on another tech different from resolving' +
    ' tech', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'B' },
                    order: 'dependenceBeforeDependants',
                    tech: 'css'
                },
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants',
                    tech: 'css'
                }
            ]
        },
        {
            entity: { block: 'B' },
            dependOn: [{
                entity: { block: 'D' },
                order: 'dependenceBeforeDependants',
                tech: 'js'
            }]
        },
        {
            entity: { block: 'C' },
            dependOn: [{
                entity: { block: 'D' },
                order: 'dependenceBeforeDependants',
                tech: 'js'
            }]
        }
    ];
    const opts = { tech: 'css' };
    const resolved = resolve(decl, deps, opts);

    expect(resolved.dependOn).to.contain({
        entities: [{ block: 'D' }],
        tech: 'js'
    });
});
