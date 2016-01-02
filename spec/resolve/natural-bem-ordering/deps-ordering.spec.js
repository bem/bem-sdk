import { expect } from 'chai';
import { findIndex } from '../../utils';
import { resolve } from '../../../lib';

describe('resolve: natural BEM entities ordering for deps', function () {
    it('should place block before its element', function () {
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
            indexElem = findIndex(resolved.entities, { block: 'A', elem: 'e' });

        expect(indexBlock).to.be.below(indexElem);
    });

    it('should place block before its boolean modifier', function () {
        var decl = [
                { block: 'A', modName: 'm', modVal: true }
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
            indexModifier = findIndex(resolved.entities, { block: 'A', modName: 'm' });

        expect(indexBlock).to.be.below(indexModifier);
    });

    it('should place block before its key-value modifier', function () {
        var decl = [
                { block: 'A', modName: 'm', modVal: 'any' }
            ],
            deps = [
                {
                    entity: { block: 'A', modName: 'm', modVal: 'any' },
                    dependOn: [
                        {
                            entity: { block: 'A' }
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBlock = findIndex(resolved.entities, { block: 'A' }),
            indexModifier = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'any' });

        expect(indexBlock).to.be.below(indexModifier);
    });

    it('should place block before its element with boolean modifier', function () {
        var decl = [
                { block: 'A', elem: 'e', modName: 'm', modVal: true }
            ],
            deps = [
                {
                    entity: { block: 'A', elem: 'e', modName: 'm', modVal: true },
                    dependOn: [
                        {
                            entity: { block: 'A' }
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBlock = findIndex(resolved.entities, { block: 'A' }),
            indexElem = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: true });

        expect(indexBlock).to.be.below(indexElem);
    });

    it('should place block before its element with key-value modifier', function () {
        var decl = [
                { block: 'A', elem: 'e', modName: 'm', modVal: 'any' }
            ],
            deps = [
                {
                    entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'any' },
                    dependOn: [
                        {
                            entity: { block: 'A' }
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBlock = findIndex(resolved.entities, { block: 'A' }),
            indexElem = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: 'any' });

        expect(indexBlock).to.be.below(indexElem);
    });

    it('should place block\'s boolean modifier before block key-value modifier', function () {
        var decl = [
                { block: 'A', modName: 'm', modVal: 'any' }
            ],
            deps = [
                {
                    entity: { block: 'A', modName: 'm', modVal: 'any' },
                    dependOn: [
                        {
                            entity: { block: 'A', modName: 'm', modVal: true }
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBoolean = findIndex(resolved.entities, { block: 'A', modName: 'n', modVal: true }),
            indexKeyValue = findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'any' });

        expect(indexBoolean).to.be.below(indexKeyValue);
    });

    it('should place elem before its boolean modifier', function () {
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
            indexElem = findIndex(resolved.entities, { block: 'A', elem: 'e' }),
            indexModifier = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: true });

        expect(indexElem).to.be.below(indexModifier);
    });

    it('should place elem before its key-value modifier', function () {
        var decl = [
                { block: 'A', elem: 'e', modName: 'm', modVal: 'any' }
            ],
            deps = [
                {
                    entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'any' },
                    dependOn: [
                        {
                            entity: { block: 'A', elem: 'e' }
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexElem = findIndex(resolved.entities, { block: 'A', elem: 'e' }),
            indexModifier = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: 'any' });

        expect(indexElem).to.be.below(indexModifier);
    });

    it('should place elem\'s boolean modifier before elem key-value modifier', function () {
        var decl = [
                { block: 'A', elem: 'e', modName: 'm', modVal: 'any' }
            ],
            deps = [
                {
                    entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'any' },
                    dependOn: [
                        {
                            entity: { block: 'A', elem: 'e', modName: 'm', modVal: true }
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBoolean = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: true }),
            indexKeyValue = findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: 'any' });

        expect(indexBoolean).to.be.below(indexKeyValue);
    });
});
