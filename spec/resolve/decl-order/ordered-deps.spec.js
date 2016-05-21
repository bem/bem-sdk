'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../../lib/utils').findIndex;

test('should place ordered entity from decl before several entities depending on it', () => {
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

    expect(indexA).to.be.below(indexB);
});

test('should keep decl ordering for entities unaffected by ordering', () => {
    const decl = [
        { block: 'B' },
        { block: 'C' }
    ];
    const deps = [
        {
            entity: { block: 'B' },
            dependOn: [
                {
                    entity: { block: 'A' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexB = findIndex(resolved.entities, { block: 'B' });
    const indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexB).to.be.below(indexC);
});
