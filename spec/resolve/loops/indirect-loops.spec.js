'use strict';

const test = require('ava');

const resolve = require('../../../lib').resolve;

test('should not throw error if detected unordered indirect loop', t => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'B' }
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
                    entity: { block: 'A' }
                }
            ]
        }
    ];

    t.notThrows(() => resolve(decl, deps));
});

test('should not throw error if detected unordered indirect loop with ordered part', t => {
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
                { entity: { block: 'C' } }
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

test('should not throw error if detected ordered indirect loop', t => {
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
                    entity: { block: 'C' },
                    order: 'dependenceBeforeDependants'
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

    let error = null;

    try {
        resolve(decl, deps);
    } catch (e) {
        error = e;
    }

    t.deepEqual(error.loop, [
        { entity: { block: 'A' } },
        { entity: { block: 'B' } },
        { entity: { block: 'C' } },
        { entity: { block: 'A' } }
    ]);
});
