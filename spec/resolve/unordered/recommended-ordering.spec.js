'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../../lib/utils').findIndex;

test('should place dependency of dependency after entities from decl', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [{ entity: { block: 'B' } }]
            },
            {
                entity: { block: 'B' },
                dependOn: [{ entity: { block: 'C' } }]
            }
        ],
        resolved = resolve(decl, deps),
        indexA = findIndex(resolved.entities, { block: 'A' }),
        indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexA).to.be.below(indexC);
});

test('should keep ordering for dependencies of dependency', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [{ entity: { block: 'B' } }]
            },
            {
                entity: { block: 'B' },
                dependOn: [
                    { entity: { block: 'C' } },
                    { entity: { block: 'D' } }
                ]
            }
        ],
        resolved = resolve(decl, deps),
        indexC = findIndex(resolved.entities, { block: 'C' }),
        indexD = findIndex(resolved.entities, { block: 'D' });

    expect(indexC).to.be.below(indexD);
});
