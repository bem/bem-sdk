var expect  = require('chai').expect,
    _       = require('lodash'),
    resolve = require('../../../lib/index').resolve;

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
            indexBlock = _.findIndex(resolved.entities, { block: 'A' }),
            indexElement = _.findIndex(resolved.entities, { block: 'A', elem: 'e' });

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
            indexBlock = _.findIndex(resolved.entities, { block: 'A' }),
            indexModifier = _.findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: true });

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
            indexBlock = _.findIndex(resolved.entities, { block: 'A' }),
            indexModifier = _.findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'val' });

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
            indexElement = _.findIndex(resolved.entities, { block: 'A', elem: 'e' }),
            indexModifier = _.findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: true });

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
            indexElement = _.findIndex(resolved.entities, { block: 'A', elem: 'e' }),
            indexModifier = _.findIndex(resolved.entities, { block: 'A', elem: 'e', modName: 'm', modVal: 'val' });

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
            indexBoolean = _.findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: true }),
            indexKeyValue = _.findIndex(resolved.entities, { block: 'A', modName: 'm', modVal: 'val' });

        expect(indexBoolean).to.be.below(indexKeyValue);
    });
});
