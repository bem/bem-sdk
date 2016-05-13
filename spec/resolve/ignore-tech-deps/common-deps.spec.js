'use strict';

const test = require('ava');
const expect = require('chai').expect;
const resolve = require('../../../lib').resolve;

test('should ignore unordered tech dependency on entity', () => {
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
        resolved = resolve(decl, deps);

    expect(resolved.entities).to.not.contain({ block: 'B' });
});

test('should ignore unordered tech dependency on same tech', () => {
    var decl = [{ block: 'A' }],
        deps = [
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
        resolved = resolve(decl, deps);

    expect(resolved.entities).to.not.contain({ block: 'B' });
});

test('should ignore unordered tech dependency on another tech', () => {
    var decl = [{ block: 'A' }],
        deps = [
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
        resolved = resolve(decl, deps);

    expect(resolved.dependOn).to.be.empty;
});

test('should ignore tech deps when resolving common deps in same way for ordered and unordered deps', () => {
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
        resolvedUnordered = resolve(decl, unorderedDeps),
        resolvedOrdered = resolve(decl, orderedDeps);

    expect(resolvedOrdered).to.be.deep.equal(resolvedUnordered);
});
