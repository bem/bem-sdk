'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../../lib').resolve;

const macro = require('../../../../lib/utils').depsMacro;
const _ = require('lodash');
const findIndex = require('../../../../lib/utils').findIndex;
const findLastIndex = require('../../../../lib/utils').findLastIndex;

test('should resolve entity depending on another entity', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [{
                entity: { block: 'B' },
                tech: 'js'
            }]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps, { tech: 'css' });

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'B' }],
            tech: 'js'
        });
    }
});

test('should resolve tech depending on multiple techs', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [
                {
                    entity: { block: 'B' },
                    tech: 'bemhtml'
                },
                {
                    entity: { block: 'B' },
                    tech: 'js'
                }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps, { tech: 'css' });

        expect(resolved.dependOn).to.contain(
            {
                entities: [{ block: 'B' }],
                tech: 'bemhtml'
            }
        ).and.to.contain(
            {
                entities: [{ block: 'B' }],
                tech: 'js'
            }
        );
    }
});

test('should resolve multiple tech in entity depending on tech', macro, {
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
            entity: { block: 'A' },
            tech: 'js',
            dependOn: [
                {
                    entity: { block: 'B' },
                    tech: 'js'
                }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps, { tech: 'css' });

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'B' }],
            tech: 'js'
        });
    }
});

test('should resolve tech in multiple entities depending on different with resolving tech in another ' +
    'entity', macro, {
    decl: [
        { block: 'A' },
        { block: 'B' }
    ],
    deps: [
        {
            entity: { block: 'A' },
            tech: 'css',
            dependOn: [{
                entity: { block: 'C' },
                tech: 'js'
            }]
        },
        {
            entity: { block: 'B' },
            tech: 'css',
            dependOn: [{
                entity: { block: 'C' },
                tech: 'js'
            }]
        }
    ],
    test: (t, decl, deps) => {
        const resolved = resolve(decl, deps, { tech: 'css' });

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'C' }],
            tech: 'js'
        });
    }
});

test('should resolve tech dependency depending on tech different with resolving in another entity', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'B' },
                    tech: 'css'
                }
            ]
        },
        {
            entity: { block: 'B' },
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
            entities: [{ block: 'C' }],
            tech: 'js'
        });
    }
});

test('should resolve tech dependency depending on tech different from resolving tech', macro, {
    decl: [{ block: 'A' }],
    deps: [
        {
            entity: { block: 'A' },
            dependOn: [
                {
                    entity: { block: 'B' },
                    tech: 'css'
                }
            ]
        },
        {
            entity: { block: 'B' },
            dependOn: [
                {
                    entity: { block: 'C' },
                    tech: 'bemhtml'
                },
                {
                    entity: { block: 'D' },
                    tech: 'js'
                }
            ]
        }
    ],
    test: (t, decl, deps) => {
        const opts = { tech: 'css' };
        const resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain(
            {
                entities: [{ block: 'C' }],
                tech: 'bemhtml'
            }
        ).and.to.contain(
            {
                entities: [{ block: 'D' }],
                tech: 'js'
            }
        );
    }
});

test('should include tech to result once if tech of multiple entities depends on this tech and this tech is' +
    ' not matching with resolving tech', macro, {
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
                    entity: { block: 'C' },
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
        const jsDepsIndex = _.findIndex(resolved.dependOn, function (techDeps) {
            return techDeps.tech === 'js';
        });
        const firstIndex = findIndex(resolved.dependOn[jsDepsIndex], { block: 'C' });
        const lastIndex = findLastIndex(resolved.dependOn[jsDepsIndex], { block: 'C' });

        expect(jsDepsIndex).to.not.be.equal(-1);
        expect(firstIndex).to.be.equal(lastIndex);
    }
});
