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
                order: 'dependenceBeforeDependants'
            }]
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
                    order: 'dependenceBeforeDependants'
                },
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps, { tech: 'css' });

    expect(resolved.entities).to.contain({ block: 'B' })
        .and.to.contain({ block: 'C' });
});

test('should resolve multiple techs in entity depending on another entity', () => {
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
            entity: { block: 'A' },
            tech: 'js',
            dependOn: [
                {
                    entity: { block: 'B' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];
    const opts = { tech: 'css' };
    const resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'B' });
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
                    order: 'dependenceBeforeDependants'
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
