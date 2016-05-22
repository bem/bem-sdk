'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../../lib').resolve;
const findIndex = require('../../../../lib/utils').findIndex;
const findLastIndex = require('../../../../lib/utils').findLastIndex;

test('should resolve entity depending on another entity', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [{
                entity: { block: 'B' },
                order: 'dependenceBeforeDependants',
                tech: 'css'
            }]
        }
    ];
    const resolved = resolve(decl, deps, { tech: 'css' });

    expect(resolved.entities).to.contain({ block: 'B' });
});

test('should resolve entity depending by multiple techs on another entity', () => {
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
                },
                {
                    entity: { block: 'B' },
                    order: 'dependenceBeforeDependants',
                    tech: 'js'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps, { tech: 'css' });

    expect(resolved.entities).to.contain({ block: 'B' });
});

test('should resolve entity depending on multiple entities', () => {
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
                },
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants',
                    tech: 'css'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps, { tech: 'css' });

    expect(resolved.entities).to.contain({ block: 'B' })
        .and.to.contain({ block: 'C' });
});

test('should include entity to result once if multiple entities depend on this entity', () => {
    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];
    const deps = [
        {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'C' },
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
    const firstIndex = findIndex(resolved.entities, { block: 'C' });
    const lastIndex = findLastIndex(resolved.entities, { block: 'C' });

    expect(resolved.entities).to.contain({ block: 'C' });
    expect(firstIndex).to.be.equal(lastIndex);
});
