'use strict';

const test = require('ava');
const expect = require('chai').expect;

const resolve = require('../../../lib').resolve;

test('should save declaration order when resolve ordered and unordered deps of another dependency', () => {
    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];
    const relations = [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants'
                },
                {
                    entity: { block: 'D' }
                }
            ]
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

test('should resolve ordered and unordered dependencies of declaration entity', () => {
    const decl = [
        { block: 'A' }
    ];
    const relations = [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'B' },
                    order: 'dependenceBeforeDependants'
                },
                {
                    entity: { block: 'D' }
                },
                {
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];

    const resolved = resolve(decl, relations);

    expect(resolved.entities).to.deep.equal([
        { block: 'B' },
        { block: 'C' },

        { block: 'A' },

        { block: 'D' }
    ]);
});
