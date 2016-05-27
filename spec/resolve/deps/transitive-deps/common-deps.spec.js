'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../../lib').resolve;
const macro = require('../../../../lib/utils').depsMacro;

test('should resolve transitive dependency', macro, {
    decl: [{ block: 'A' }],
    deps: [
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
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps);

        expect(resolved.entities).to.contain({ block: 'C' });
    }
});

test('should resolve transitive entity depending on multiple dependencies', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'A' },
            dependOn: [
                { entity: { block: 'B' } }
            ]
        },
        {
            entity: { block: 'B' },
            dependOn: [
                { entity: { block: 'C' } },
                { entity: { block: 'D' } }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps);

        expect(resolved.entities).to.contain({ block: 'C' })
            .and.to.contain({ block: 'D' });
    }
});
