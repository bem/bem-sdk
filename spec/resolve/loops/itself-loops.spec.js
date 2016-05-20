'use strict';

const test = require('ava');

const resolve = require('../../../lib').resolve;

test('should not throw error if detected unordered loop on itself', t => {
    const decl = [{ block: 'A' }];
    const deps = [{
        entity: { block: 'A' },
        dependOn: [{ entity: { block: 'A' } }]
    }];

    t.notThrows(() => resolve(decl, deps));
});

test('should not throw error if detected ordered loop on itself', t => {
    const decl = [{ block: 'A' }];
    const deps = [{
        entity: { block: 'A' },
        dependOn:[{
            entity: { block: 'A' },
            order: 'dependenceBeforeDependants'
        }]
    }];

    t.notThrows(() => resolve(decl, deps));
});
