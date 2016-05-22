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
                    tech: 'css'
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
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps, { tech: 'css' });

    expect(resolved.entities).to.contain({ block: 'C' });
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
                    tech: 'css'
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
                    entity: { block: 'D' },
                    order: 'dependenceBeforeDependants',
                    tech: 'css'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps, { tech: 'css' });

    expect(resolved.entities).to.contain({ block: 'C' })
        .and.to.contain({ block: 'D' });
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

    expect(resolved.entities).to.contain({ block: 'C' });
});
