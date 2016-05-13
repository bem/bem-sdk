'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;
const findIndex = require('../../utils').findIndex;
const findLastIndex = require('../../utils').findLastIndex;

test('should resolve tech in entity depending on another entity', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [{
                    entity: { block: 'B' }
                }]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'B' });
});

test('should resolve tech in entity depending on multiple entities', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'B' }
                    },
                    {
                        entity: { block: 'C' }
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'B' })
        .and.to.contain({ block: 'C' });
});

test('should resolve multiple techs in entity depending on another entity', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [
                    { entity: { block: 'B' } }
                ]
            },
            {
                entity: { block: 'A' },
                tech: 'js',
                dependOn: [
                    { entity: { block: 'B' } }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'B' });
});

test('should resolve tech in multiple entities depending on another entity', () => {
    var decl = [
            { block: 'A' },
            { block: 'B' }
        ],
        deps = [
            {
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [{ entity: { block: 'C' } }]
            },
            {
                entity: { block: 'B' },
                tech: 'css',
                dependOn: [{ entity: { block: 'C' } }]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'C' });
});

test('should resolve tech dependency depending on another entity', () => {
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
                        entity: { block: 'C' }
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'C' });
});

test('should resolve tech dependency depending on multiple entities', () => {
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
                        entity: { block: 'C' }
                    },
                    {
                        entity: { block: 'D' }
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'C' })
        .and.to.contain({ block: 'D' });
});

test('should resolve multiple tech dependencies depending on another entity', () => {
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
                dependOn: [{ entity: { block: 'D' } }]
            },
            {
                entity: { block: 'C' },
                dependOn: [{ entity: { block: 'D' } }]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.contain({ block: 'D' });
});

test('should include entity once if tech of multiple entities depend on this entity', () => {
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
                        entity: { block: 'C' }
                    }
                ]
            },
            {
                entity: { block: 'B' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'C' }
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

test('should not include tech dependency if no entity from decl depends on it and this entity has ' +
    'dependency on entity listed in decl', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'B' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'A' }
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
                        entity: { block: 'D' }
                    }
                ]
            }
        ],
        opts = { tech: 'css' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.not.contain({ block: 'D' });
});
