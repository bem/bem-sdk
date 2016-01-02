import { expect } from 'chai';
import { resolve } from '../../../lib';

describe('resolve: ignoring tech if dependant techs mismatching resolving tech', function () {
    it('should ignore entity dependency on mismatched tech', function () {
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

    it('should ignore unordered tech dependency on other and mismatched tech', function () {
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

    it('should ignore tech dependency on same and mismatched tech', function () {
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

    it('should ignore tech deps for mismatching techs in same way for ordered and unordered deps', function () {
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
});
