'use strict';

const test = require('ava');

const resolve = require('../../../lib').resolve;

test('should throw error if detected ordered loop between same techs', t => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    order: 'dependenceBeforeDependants'
                }
            ]
        },
        {
            entity: { block: 'B' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];

    let error = null;

    try {
        resolve(decl, deps, { tech: 'css' });
    } catch (e) {
        error = e;
    }

    t.deepEqual(error.loop, [
        { entity: { block: 'A' } },
        { entity: { block: 'B' } },
        { entity: { block: 'A' } }
    ]);
});

test('should not throw error if detected loop between different techs', t => {
    const decl = [{ block: 'A' }];
    const deps = [
        {
            entity: { block: 'A' },
            tech: 'js',
            dependOn: [
                {
                    entity: { block: 'B' },
                    tech: 'bemhtml',
                    order: 'dependenceBeforeDependants'
                }
            ]
        },
        {
            entity: { block: 'B' },
            tech: 'js',
            dependOn: [
                {
                    entity: { block: 'A' },
                    tech: 'bemhtml',
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];

    t.notThrows(() => resolve(decl, deps, { tech: 'js' }));
});

test('should throw error if detected loop between common and specific techs', t => {
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
                    entity: { block: 'A' },
                    tech: 'css',
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
        { entity: { block: 'A' } }
    ]);
});

test('should throw error if detected loop between common and other techs', t => {
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
                    entity: { block: 'A' },
                    tech: 'css',
                    order: 'dependenceBeforeDependants'
                }
            ]
        }
    ];

    let error = null;

    try {
        resolve(decl, deps, { tech: 'css' });
    } catch (e) {
        error = e;
    }

    t.deepEqual(error.loop, [
        { entity: { block: 'A' } },
        { entity: { block: 'B' } },
        { entity: { block: 'A' } }
    ]);
});

test('should not throw error if detected loop on itself with other tech', t => {
    const decl = [{ block: 'A' }];
    const deps = [{
        entity: { block: 'A' },
        tech: 'css',
        dependOn: [{
            entity: { block: 'A' },
            tech: 'js',
            order: 'dependenceBeforeDependants'
        }]
    }];

    t.notThrows(() => resolve(decl, deps, { tech: 'css' }));
});
