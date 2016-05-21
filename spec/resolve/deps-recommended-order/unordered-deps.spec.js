'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../../lib/utils').findIndex;

test('should keep the ordering described in deps', () => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                { entity: { block: 'B' } },
                { entity: { block: 'C' } }
            ]
        }
    ];
    const resolved = resolve(decl, deps);
    const indexB = findIndex(resolved.entities, { block: 'B' });
    const indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexB).to.be.below(indexC);
});

test('should keep ordering for transitive dependencies', () => {
    const decl = [{ block: 'A' }];
    const deps = [
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
    ];
    const resolved = resolve(decl, deps);
    const indexC = findIndex(resolved.entities, { block: 'C' });
    const indexD = findIndex(resolved.entities, { block: 'D' });

    expect(indexC).to.be.below(indexD);
});
