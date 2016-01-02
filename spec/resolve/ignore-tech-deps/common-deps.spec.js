import { expect } from 'chai';
import { resolve } from '../../../lib';

describe('resolve: ignoring tech dependencies when resolving common deps', function () {
    it('should ignore unordered tech dependency on entity', function () {
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

    it('should ignore unordered tech dependency on same tech', function () {
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

    it('should ignore unordered tech dependency on another tech', function () {
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

    it('should ignore tech deps when resolving common deps in same way for ordered and unordered deps', function () {
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
});
