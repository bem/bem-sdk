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
                    tech: 'css'
                }]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'B' });
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
                        tech: 'css'
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

    expect(resolved.entities).to.contain({ block: 'B' });
});

test('should resolve multiple tech in entity depending on another tech', () => {
    var decl = [{ block: 'A' }],
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
            },
            {
                entity: { block: 'A' },
                tech: 'js',
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

    expect(resolved.entities).to.contain({ block: 'B' });
});

test('should resolve multiple tech in entity depending on multiple techs in another entity and one of this techs ' +
    'matching with resolving tech', () => {
    var decl = [{ block: 'A' }],
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

    expect(resolved.entities).to.contain({ block: 'B' });
});

test('should resolve tech in multiple entities depending on same with resolving tech in another ' +
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
                    tech: 'css'
                }]
            },
            {
                entity: { block: 'B' },
                tech: 'css',
                dependOn: [{
                    entity: { block: 'C' },
                    tech: 'css'
                }]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'C' });
});

test('should resolve tech in multiple entities depending on multiple techs of entity and 1 of this techs same ' +
    'with resolving', () => {
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
                    tech: 'css'
                }]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'C' });
});

test('should resolve tech dependency depending on tech same with resolving in another entity', () => {
    var decl = [{ block: 'A' }],
        deps = [
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
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'C' },
                        tech: 'css'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'C' });
});

test('should resolve tech dependency depending on techs same with resolving tech', () => {
    var decl = [{ block: 'A' }],
        deps = [
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
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'C' },
                        tech: 'css'
                    },
                    {
                        entity: { block: 'D' },
                        tech: 'css'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'C' })
        .and.to.contain({ block: 'D' });
});

test('should resolve multiple tech dependencies depending on another tech same with resolving tech', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                dependOn: [
                    {
                        entity: { block: 'B' }
                    },
                    {
                        entity: { block: 'C' }
                    }
                ]
            },
            {
                entity: { block: 'B' },
                tech: 'css',
                dependOn: [{
                    entity: { block: 'D' },
                    tech: 'css'
                }]
            },
            {
                entity: { block: 'C' },
                tech: 'css',
                dependOn: [{
                    entity: { block: 'D' },
                    tech: 'css'
                }]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'D' });
});

test('should include tech to result once if tech of multiple entities depend on this tech and this tech matches' +
    ' with resolving tech', () => {
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
                        tech: 'css'
                    }
                ]
            },
            {
                entity: { block: 'B' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'C' },
                        tech: 'css'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts),
        firstIndex = findIndex(resolved.entities, { block: 'C' }),
        lastIndex = findLastIndex(resolved.entities, { block: 'C' });

    expect(resolved.entities).to.contain({ block: 'C' });
    expect(firstIndex).to.be.equal(lastIndex);
});

test('should not include tech dependency if no entity from decl depends on it and this entity has tech' +
    'dependency on entity listed in decl', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'B' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'A' },
                        tech: 'css'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).not.to.contain({ block: 'B' });
});

test('should not include tech dependencie\'s dependency if no entity from decl\'s dependencies depends ' +
    'on it', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'C' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'D' },
                        tech: 'css'
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.not.contain({ block: 'D' });
});
