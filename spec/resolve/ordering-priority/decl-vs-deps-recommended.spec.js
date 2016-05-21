'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../../lib/utils').findIndex;

test('should save user order for unordered dependencies', () => {
    const decl = [{ block: 'A' }];
    const relations = [
        {
            entity: { block: 'A' },
            dependOn: [
                { entity: { block: 'B' } },
                { entity: { block: 'C' } }
            ]
        }
    ];

    const resolved = resolve(decl, deps);
    const indexA = findIndex(resolved.entities, { block: 'A' });
    const indexB = findIndex(resolved.entities, { block: 'B' });
    const indexC = findIndex(resolved.entities, { block: 'C' });

    expect(indexA).to.be.below(indexB)
        .and.to.be.below(indexC);
});
