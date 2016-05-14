const _ = require('lodash');
'use strict';

const test = require('ava');
const expect = require('chai').expect;

const resolve = require('../../../../lib').resolve;
const findIndex = require('../../../../lib/utils').findIndex;
const findLastIndex = require('../../../../lib/utils').findLastIndex;

test('should resolve tech depending on another tech', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [{
                    entity: { block: 'B' },
                    tech: 'js'
                }]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.dependOn).to.contain({
        entities: [{ block: 'B' }],
        tech: 'js'
    });
});

test('should resolve tech depending on multiple techs', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'B' },
                        tech: 'bh'
                    },
                    {
                        entity: { block: 'B' },
                        tech: 'js'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.dependOn).to.contain(
        {
            entities: [{ block: 'B' }],
            tech: 'bh'
        }
    ).and.to.contain(
        {
            entities: [{ block: 'B' }],
            tech: 'js'
        }
    );
});

test('should resolve multiple tech in entity depending on tech', () => {
    var decl = [{ block: 'A' }],
        deps = [
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
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.dependOn).to.contain({
        entities: [{ block: 'B' }],
        tech: 'js'
    });
});

test('should resolve tech in multiple entities depending on different with resolving tech in another ' +
    'entity', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
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
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.dependOn).to.contain({
        entities: [{ block: 'C' }],
        tech: 'js'
    });
});

test('should resolve tech dependency depending on tech different with resolving in another entity', () => {
    var decl = [{ block: 'A' }],
        deps = [
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
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.dependOn).to.contain({
        entities: [{ block: 'C' }],
        tech: 'js'
    });
});

test('should resolve tech dependency depending on tech different from resolving tech', () => {
    var decl = [{ block: 'A' }],
        deps = [
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
                        tech: 'bh'
                    },
                    {
                        entity: { block: 'D' },
                        tech: 'js'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.dependOn).to.contain(
        {
            entities: [{ block: 'C' }],
            tech: 'bh'
        }
    ).and.to.contain(
        {
            entities: [{ block: 'D' }],
            tech: 'js'
        }
    );
});

test('should resolve multiple tech dependencies depending on another tech different from resolving' +
    ' tech', () => {
    var decl = [{ block: 'A' }],
        deps = [
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
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.dependOn).to.contain({
        entities: [{ block: 'D' }],
        tech: 'js'
    });
});

test('should include tech to result once if tech of multiple entities depends on this tech and this tech is' +
    ' not matching with resolving tech', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
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
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts),
        jsDepsIndex = _.findIndex(resolved.dependOn, function (techDeps) {
            return techDeps.tech === 'js';
        }),
        firstIndex = findIndex(resolved.dependOn[jsDepsIndex], { block: 'C' }),
        lastIndex = findLastIndex(resolved.dependOn[jsDepsIndex], { block: 'C' });

    expect(jsDepsIndex).to.not.be.equal(-1);
    expect(firstIndex).to.be.equal(lastIndex);
});

test('should not add tech to dependOn if dependency matching resolving tech', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
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
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.dependOn).to.be.empty;
});
