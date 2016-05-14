'use strict';

const test = require('ava');
const expect = require('chai').expect;

const resolve = require('../../../lib').resolve;

test('should resolve ordered dependencies independently for each declaration entity', () => {
    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];
    const relations = [
        {
            entity: { block: 'A' },
            dependOn: [{
                entity: { block: 'C' },
                order: 'dependenceBeforeDependants'
            }]
        },
        {
            entity: { block: 'B' },
            dependOn: [{
                entity: { block: 'D' },
                order: 'dependenceBeforeDependants'
            }]
        }
    ];

    const resolved = resolve(decl, relations);

    expect(resolved.entities).to.deep.equal([
        { block: 'C' },
        { block: 'A' },

        { block: 'D' },
        { block: 'B' }
    ]);
});

test('should resolve ordered dependencies independently of declaration entity', () => {
    const decl = [
        { block: 'A' },
    ];
    const relations = [
        {
            entity: { block: 'A' },
            dependOn: [{
                entity: { block: 'B' }
            }]
        },
        {
            entity: { block: 'B' },
            dependOn: [{
                entity: { block: 'C' },
                order: 'dependenceBeforeDependants'
            }]
        }
    ];

    const resolved = resolve(decl, relations);

    expect(resolved.entities).to.deep.equal([
        { block: 'A' },

        { block: 'C' },
        { block: 'B' }
    ]);
});
