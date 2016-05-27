'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../../lib').resolve;

const macro = require('../../../../lib/utils').depsMacro;

test('should not include entity if no entity from decl depends on it', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'B' },
            dependOn: []
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps);

        expect(resolved.entities).to.not.contain({ block: 'B' });
    }
});

test('should not include entity if no entity from decl depends on it and this entity has dependency on entity' +
    ' listed in decl', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'B' },
            dependOn: [
                { entity: { block: 'A' } }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps);

        expect(resolved.entities).not.to.contain({ block: 'B' });
    }
});

test('should not include dependency if no entity from decl\'s dependencies depends on it', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'C' },
            dependOn: [
                {
                    entity: { block: 'D' }
                }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps);

        expect(resolved.entities).to.not.contain({ block: 'D' });
    }
});
