import { expect } from 'chai';
import { findIndex } from '../../utils';
import { resolve } from '../../../lib';

describe('resolve: ordering priority - ordered deps vs natural bem ordering', function () {
    it('should prioritise ordered dependency over block-element natural ordering', function () {
        var decl = [
                { block: 'B' },
                { block: 'A', elem: 'e' }
            ],
            deps = [
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'A', elem: 'e' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBlock = findIndex(resolved.entities, { block: 'B' }),
            indexElement = findIndex(resolved.entities, { block: 'A', elem: 'e' });

        expect(indexElement).to.be.below(indexBlock);
    });

    it('should prioritise ordered dependency over block - boolean modifier natural ordering', function () {
        var decl = [
                { block: 'B' },
                { block: 'A', modName: 'm', modVal: true }
            ],
            deps = [
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'A', modName: 'm', modVal: true },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBlock = findIndex(resolved.entities, { block: 'B' }),
            indexModifier = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: true });

        expect(indexModifier).to.be.below(indexBlock);
    });

    it('should prioritise ordered dependency over block - key-value modifier natural ordering', function () {
        var decl = [
                { block: 'B' },
                { block: 'A', modName: 'm', modVal: 'val' }
            ],
            deps = [
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'A', modName: 'm', modVal: 'val' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBlock = findIndex(resolved.entities, { block: 'B' }),
            indexModifier = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'val' });

        expect(indexModifier).to.be.below(indexBlock);
    });

    it('should prioritise ordered dependency over element - element boolean modifier natural ordering', function () {
        var decl = [
                { block: 'B', elem: 'e' },
                { block: 'A', elem: 'e', modName: 'm', modVal: true }
            ],
            deps = [
                {
                    entity: { block: 'B', elem: 'e' },
                    dependOn: [
                        {
                            entity: { block: 'A', elem: 'e', modName: 'm', modVal: true },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexElement = findIndex(resolved.entities, { block: 'B', elem: 'e' }),
            indexModifier = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: true });

        expect(indexModifier).to.be.below(indexElement);
    });

    it('should prioritise ordered dependency over element - element key-value modifier natural ordering', function () {
        var decl = [
                { block: 'B', elem: 'e' },
                { block: 'A', elem: 'e', modName: 'm', modVal: 'val' }
            ],
            deps = [
                {
                    entity: { block: 'B', elem: 'e' },
                    dependOn: [
                        {
                            entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'val' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexElement = findIndex(resolved.entities, { block: 'B', elem: 'e' }),
            indexModifier = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: 'val' });

        expect(indexModifier).to.be.below(indexElement);
    });

    it('should prioritise ordered dependency over boolean modifier - key-value modifier natural ordering', function () {
        var decl = [
                { block: 'B', modName: 'm', modVal: true },
                { block: 'A', modName: 'm', modVal: 'val' }
            ],
            deps = [
                {
                    entity: { block: 'B', modName: 'm', modVal: true },
                    dependOn: [
                        {
                            entity: { block: 'A', modName: 'm', modVal: 'val' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBoolean = findIndex(resolved.entities, { block: 'B', modName: 'm', modVal: true }),
            indexKeyValue = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'val' });

        expect(indexKeyValue).to.be.below(indexBoolean);
    });
});
