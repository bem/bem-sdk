'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;

test('should ignore entity dependency on mismatched tech', () => {
    var decl = [{ block: 'A' }],
        deps = [
            {
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [
                    { entity: { block: 'B' } }
                ]
            }
        ],
        opts = { tech: 'js' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.not.contain({ block: 'B' });
});

test('should ignore unordered tech dependency on other and mismatched tech', () => {
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
            }
        ],
        opts = { tech: 'js' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.entities).to.not.contain({ block: 'B' });
});

test('should ignore tech dependency on same and mismatched tech', () => {
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
            }
        ],
        opts = { tech: 'js' },
        resolved = resolve(decl, deps, opts);

    expect(resolved.dependOn).to.be.empty;
});

test('should ignore tech deps for mismatching techs in same way for ordered and unordered deps', () => {
    var decl = [{ block: 'A' }],
        unorderedDeps = [
            {
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [
                    { entity: { block: 'B' } }
                ]
            }
        ],
        orderedDeps = [
            {
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [
                    {
                        entity: { block: 'B' },
                        order: 'dependenceBeforeDependants'
                    }
                ]
            }
        ],
        opts = { tech: 'js' },
        resolvedUnordered = resolve(decl, unorderedDeps, opts),
        resolvedOrdered = resolve(decl, orderedDeps, opts);

    expect(resolvedOrdered).to.be.deep.equal(resolvedUnordered);
});
