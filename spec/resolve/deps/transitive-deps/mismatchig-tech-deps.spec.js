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
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'B' },
                    tech: 'js'
                }
            ]
        },
        {
            entity: { block: 'B' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'C' },
                    tech: 'js'
                }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps, { tech: 'css' });

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'B' }, { block: 'C' }],
            tech: 'js'
        });
    }
});

test('should resolve transitive depending on multiple dependencies', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'B' },
                    tech: 'js'
                }
            ]
        },
        {
            entity: { block: 'B' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'C' },
                    tech: 'js'
                },
                {
                    entity: { block: 'D' },
                    tech: 'js'
                }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps, { tech: 'css' });

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'B' }, { block: 'C' }, { block: 'D' }],
            tech: 'js'
        });
    }
});

test('should resolve transitive depending by multiple techs on another entity', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [
                { entity: { block: 'B' } }
            ]
        },
        {
            entity: { block: 'B' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'C' },
                    tech: 'css'
                },
                {
                    entity: { block: 'C' },
                    tech: 'js'
                }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const opts = { tech: 'css' };
        const resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'C' }],
            tech: 'js'
        });
    }
});

test('should resolve multiple tech dependencies depending on another tech different from resolving' +
    ' tech', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'B' },
                    tech: 'css'
                },
                {
                    entity: { block: 'C' },
                    tech: 'css'
                }
            ]
        },
        {
            entity: { block: 'B' },
            dependOn: [{
                entity: { block: 'D' },
                tech: 'js'
            }]
        },
        {
            entity: { block: 'C' },
            dependOn: [{
                entity: { block: 'D' },
                tech: 'js'
            }]
        }
    ],
    test: (t, decl, deps) => {
        const opts = { tech: 'css' };
        const resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'D' }],
            tech: 'js'
        });
    }
});
