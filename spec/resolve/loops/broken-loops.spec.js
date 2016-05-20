'use strict';

const test = require('ava');

const resolve = require('../../../lib').resolve;

test('should not throw error if detected ordered loop broken in the middle by unordered dependency', t => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'B' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        },
        {
            entity: { block: 'B' },
            dependOn: [
                {
                    entity: { block: 'C' }
                }
            ]
        },
        {
            entity: { block: 'C' },
            dependOn: [
                {
                    entity: { block: 'A' },
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];

    t.notThrows(() => resolve(decl, deps));
});
