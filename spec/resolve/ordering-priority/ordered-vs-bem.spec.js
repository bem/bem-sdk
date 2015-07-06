var expect  = require('chai').expect,
    _       = require('lodash'),
    resolve = require('../../../lib/index').resolve;

describe('resolve: ordering priority - ordered deps vs natural bem ordering', function () {
    it('should prioritise ordered dependency over block-element natural ordering', function () {
        var decl = [
                { block: 'A' },
                { block: 'A', elem: 'e' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'A', elem: 'e' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBlock = _.findIndex(resolved.entities, { block: 'A' }),
            indexElement = _.findIndex(resolved.entities, { block: 'A', elem: 'e' });

        expect(indexElement).to.be.below(indexBlock);
    });

    it('should prioritise ordered dependency over block - boolean modifier natural ordering', function () {
        var decl = [
                { block: 'A' },
                { block: 'A', modName: 'm', modVal: true }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'A', modName: 'm', modVal: true },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBlock = _.findIndex(resolved.entities, { block: 'A' }),
            indexModifier = _.findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: true });

        expect(indexModifier).to.be.below(indexBlock);
    });

    it('should prioritise ordered dependency over block - key-value modifier natural ordering', function () {
        var decl = [
                { block: 'A' },
                { block: 'A', modName: 'm', modVal: 'val' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'A', modName: 'm', modVal: 'val' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBlock = _.findIndex(resolved.entities, { block: 'A' }),
            indexModifier = _.findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'val' });

        expect(indexModifier).to.be.below(indexBlock);
    });

    it('should prioritise ordered dependency over element - element boolean modifier natural ordering', function () {
        var decl = [
                { block: 'A', elem: 'e' },
                { block: 'A', elem: 'e', modName: 'm', modVal: true }
            ],
            deps = [
                {
                    entity: { block: 'A', elem: 'e' },
                    dependOn: [
                        {
                            entity: { block: 'A', elem: 'e', modName: 'm', modVal: true },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexElement = _.findIndex(resolved.entities, { block: 'A', elem: 'e' }),
            indexModifier = _.findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: true });

        expect(indexModifier).to.be.below(indexElement);
    });

    it('should prioritise ordered dependency over element - element key-value modifier natural ordering', function () {
        var decl = [
                { block: 'A', elem: 'e' },
                { block: 'A', elem: 'e', modName: 'm', modVal: 'val' }
            ],
            deps = [
                {
                    entity: { block: 'A', elem: 'e' },
                    dependOn: [
                        {
                            entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'val' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexElement = _.findIndex(resolved.entities, { block: 'A', elem: 'e' }),
            indexModifier = _.findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: 'val' });

        expect(indexModifier).to.be.below(indexElement);
    });

    it('should prioritise ordered dependency over boolean modifier - key-value modifier natural ordering', function () {
        var decl = [
                { block: 'A', modName: 'm', modVal: true },
                { block: 'A', modName: 'm', modVal: 'val' }
            ],
            deps = [
                {
                    entity: { block: 'A', modName: 'm', modVal: true },
                    dependOn: [
                        {
                            entity: { block: 'A', modName: 'm', modVal: 'val' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = resolve(decl, deps),
            indexBoolean = _.findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: true }),
            indexKeyValue = _.findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'val' });

        expect(indexKeyValue).to.be.below(indexBoolean);
    });
});
