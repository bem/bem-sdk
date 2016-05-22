'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../../lib').resolve;

test('should resolve transitive dependency', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
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
            dependOn: [
                { entity: { block: 'B' } }
            ]
        },
        {
            entity: { block: 'B' },
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
