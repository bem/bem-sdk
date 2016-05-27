'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../../lib').resolve;

const macro = require('../../../../lib/utils').depsMacro;
const findIndex = require('../../../../lib/utils').findIndex;
const findLastIndex = require('../../../../lib/utils').findLastIndex;

test('should resolve entity depending on another entity', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'A' },
            dependOn: [{ entity: { block: 'B' } }]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps);

        expect(resolved.entities).to.contain({ block: 'B' });
    }
});

test('should resolve entity depending on multiple entities', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'A' },
            dependOn: [
                { entity: { block: 'B' } },
                { entity: { block: 'C' } }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps);

        expect(resolved.entities).to.contain({ block: 'B' })
            .and.to.contain({ block: 'C' });
    }
});

test('should include entity to result once if multiple entities depend on this entity', macro, {
    decl: [
        { block: 'A' },
        { block: 'B' }
    ],
    deps: [
        {
            entity: { block: 'A' },
            dependOn: [
                { entity: { block: 'C' } }
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
        const firstIndex = findIndex(resolved.entities, { block: 'C' });
        const lastIndex = findLastIndex(resolved.entities, { block: 'C' });

        expect(resolved.entities).to.contain({ block: 'C' });
        expect(firstIndex).to.be.equal(lastIndex);
    }
});
