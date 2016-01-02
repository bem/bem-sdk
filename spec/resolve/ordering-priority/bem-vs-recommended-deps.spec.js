import { expect } from 'chai';
import { findIndex } from '../../utils';
import { resolve } from '../../../lib';

describe('resolve: ordering priority - natural BEM ordering vs deps ordering', function () {
    it('should prioritise block-element natural ordering over recommended deps ordering', function () {
        var decl = [
                { block: 'A', elem: 'e' }
            ],
            deps = [
                {
                    entity: { block: 'A', elem: 'e' },
                    dependOn: [
                        {
                            entity: { block: 'A' }
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBlock = findIndex(resolved.entities, { block: 'A' }),
            indexElement = findIndex(resolved.entities, { block: 'A', elem: 'e' });

        expect(indexBlock).to.be.below(indexElement);
    });

    it('should prioritise block - boolean modifier natural ordering over recommended deps ordering', function () {
        var decl = [
                { block: 'A', modName: 'm', modVal: true },
            ],
            deps = [
                {
                    entity: { block: 'A', modName: 'm', modVal: true },
                    dependOn: [
                        {
                            entity: { block: 'A' }
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBlock = findIndex(resolved.entities, { block: 'A' }),
            indexModifier = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: true });

        expect(indexBlock).to.be.below(indexModifier);
    });

    it('should prioritise key-value modifier natural ordering over recommended deps ordering', function () {
        var decl = [
                { block: 'A', modName: 'm', modVal: 'val' }
            ],
            deps = [
                {
                    entity: { block: 'A', modName: 'm', modVal: 'val' },
                    dependOn: [
                        {
                            entity: { block: 'A' }
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBlock = findIndex(resolved.entities, { block: 'A' }),
            indexModifier = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'val' });

        expect(indexBlock).to.be.below(indexModifier);
    });

    it('should prioritise element - element boolean modifier natural ordering over recommended deps ' +
        'ordering', function () {
        var decl = [
                { block: 'A', elem: 'e', modName: 'm', modVal: true }
            ],
            deps = [
                {
                    entity: { block: 'A', elem: 'e', modName: 'm', modVal: true },
                    dependOn: [
                        {
                            entity: { block: 'A', elem: 'e' }
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexElement = findIndex(resolved.entities, { block: 'A', elem: 'e' }),
            indexModifier = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: true });

        expect(indexElement).to.be.below(indexModifier);
    });

    it('should prioritise element - element key-value modifier natural ordering over recommended decl ' +
        'ordering', function () {
        var decl = [
                { block: 'A', elem: 'e', modName: 'm', modVal: 'val' }
            ],
            deps = [
                {
                    entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'val' },
                    dependOn: [
                        {
                            entity: { block: 'A', elem: 'e' }
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexElement = findIndex(resolved.entities, { block: 'A', elem: 'e' }),
            indexModifier = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: 'val' });

        expect(indexElement).to.be.below(indexModifier);
    });

    it('should prioritise boolean modifier - key-value modifier natural ordering over natural decl ' +
        'ordering', function () {
        var decl = [
                { block: 'A', modName: 'm', modVal: 'val' }
            ],
            deps = [
                {
                    entity: { block: 'A', modName: 'm', modVal: 'val' },
                    dependOn: [
                        {
                            entity: { block: 'A', modName: 'm', modVal: true }
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBoolean = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: true }),
            indexKeyValue = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'val' });

        expect(indexBoolean).to.be.below(indexKeyValue);
    });
});
