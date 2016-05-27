'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../../lib').resolve;

const macro = require('../../../../lib/utils').depsMacro;

test('should not add tech to dependOn if dependency matching resolving tech', macro, {
    decl: [
        { block: 'A' },
        { block: 'B' }
    ],
    deps: [
        {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'B' },
                    tech: 'css'
                }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps, { tech: 'css' });

        expect(resolved.dependOn).to.be.empty;
    }
});

test('should not include entity if no entity from decl depends on it and this entity has dependency on entity' +
    ' listed in decl', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'B' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'A' },
                    tech: 'js'
                }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps, { tech: 'css' });

        expect(resolved.entities).not.to.contain({ block: 'B' });
    }
});

test('should not include dependency if no entity from decl\'s dependencies depends on it', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'C' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'D' },
                    tech: 'js'
                }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps, { tech: 'css' });

        expect(resolved.entities).to.not.contain({ block: 'D' });
    }
});
