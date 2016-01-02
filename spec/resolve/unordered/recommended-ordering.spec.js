import { expect } from 'chai';
import { findIndex } from '../../utils';
import { resolve } from '../../../lib';

describe('resolving unordered deps: recommended ordering', function () {
    it('should keep the ordering described in decl', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [],
            resolved = resolve(decl, deps),
            indexA = findIndex(resolved.entities, { block: 'A' }),
            indexB = findIndex(resolved.entities, { block: 'B' });

        expect(indexA).to.be.below(indexB);
    });

    it('should place entities described in decl before dependencies', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [{ entity: { block: 'B' } }]
                }
            ],
            resolved = resolve(decl, deps),
            indexA = findIndex(resolved.entities, { block: 'A' }),
            indexB = findIndex(resolved.entities, { block: 'B' });

        expect(indexB).to.be.above(indexA);
    });

    it('should keep the ordering described in deps', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        { entity: { block: 'B' } },
                        { entity: { block: 'C' } }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexB = findIndex(resolved.entities, { block: 'B' }),
            indexC = findIndex(resolved.entities, { block: 'C' });

        expect(indexB).to.be.below(indexC);
    });

    it('should not change decl order because of deps order', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'B' },
                    dependOn: [{ entity: { block: 'C' } }]
                }
            ],
            resolved = resolve(decl, deps),
            indexA = findIndex(resolved.entities, { block: 'A' }),
            indexB = findIndex(resolved.entities, { block: 'B' });

        expect(indexA).to.be.below(indexB);
    });

    it('should place dependency of dependency after entities from decl', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [{ entity: { block: 'B' } }]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [{ entity: { block: 'C' } }]
                }
            ],
            resolved = resolve(decl, deps),
            indexA = findIndex(resolved.entities, { block: 'A' }),
            indexC = findIndex(resolved.entities, { block: 'C' });

        expect(indexA).to.be.below(indexC);
    });

    it('should keep ordering for dependencies of dependency', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [{ entity: { block: 'B' } }]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        { entity: { block: 'C' } },
                        { entity: { block: 'D' } }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexC = findIndex(resolved.entities, { block: 'C' }),
            indexD = findIndex(resolved.entities, { block: 'D' });

        expect(indexC).to.be.below(indexD);
    });
});
