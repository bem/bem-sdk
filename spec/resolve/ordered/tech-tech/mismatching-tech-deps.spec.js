import { expect } from 'chai';
import _ from 'lodash';
import { findIndex } from '../../../utils';
import { findLastIndex } from '../../../utils';
import { resolve } from '../../../../lib/index';

describe('resolving ordered dependencies: tech - tech for mismatching tech', function () {
    it('should resolve tech depending on another tech', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [{
                        entity: { block: 'B' },
                        tech: 'js',
                        order: 'dependenceBeforeDependants'
                    }]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'B' }],
            tech: 'js'
        });
    });

    it('should resolve tech depending on multiple techs', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'bh',
                            order: 'dependenceBeforeDependants'
                        },
                        {
                            entity: { block: 'B' },
                            tech: 'js',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain(
            {
                entities: [{ block: 'B' }],
                tech: 'bh'
            }
        ).and.to.contain(
            {
                entities: [{ block: 'B' }],
                tech: 'js'
            }
        );
    });

    it('should resolve multiple tech in entity depending on tech', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'js',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'A' },
                    tech: 'js',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'js',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'B' }],
            tech: 'js'
        });
    });

    it('should resolve tech in multiple entities depending on different from resolving tech in another ' +
        'entity', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [{
                        entity: { block: 'C' },
                        tech: 'js',
                        order: 'dependenceBeforeDependants'
                    }]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [{
                        entity: { block: 'C' },
                        tech: 'js',
                        order: 'dependenceBeforeDependants'
                    }]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'C' }],
            tech: 'js'
        });
    });

    it('should resolve tech dependency depending on tech different from resolving in another entity', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'js',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'C' }],
            tech: 'js'
        });
    });

    it('should resolve tech dependency depending on tech different from resolving tech', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'bh',
                            order: 'dependenceBeforeDependants'
                        },
                        {
                            entity: { block: 'D' },
                            tech: 'js',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain(
            {
                entities: [{ block: 'C' }],
                tech: 'bh'
            }
        ).and.to.contain(
            {
                entities: [{ block: 'D' }],
                tech: 'js'
            }
        );
    });

    it('should resolve multiple tech dependencies depending on another tech different from resolving' +
        ' tech', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        },
                        {
                            entity: { block: 'C' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [{
                        entity: { block: 'D' },
                        tech: 'js',
                        order: 'dependenceBeforeDependants'
                    }]
                },
                {
                    entity: { block: 'C' },
                    dependOn: [{
                        entity: { block: 'D' },
                        tech: 'js',
                        order: 'dependenceBeforeDependants'
                    }]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.contain({
            entities: [{ block: 'D' }],
            tech: 'js'
        });
    });

    it('should include tech to result once if tech of multiple entities depends on this tech and this tech is' +
        ' not matching with resolving tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'js',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'js',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts),
            jsDepsIndex = _.findIndex(resolved.dependOn, function (techDeps) {
                return techDeps.tech === 'js';
            }),
            firstIndex = findIndex(resolved.dependOn[jsDepsIndex], { block: 'C' }),
            lastIndex = findLastIndex(resolved.dependOn[jsDepsIndex], { block: 'C' });

        expect(jsDepsIndex).to.not.be.equal(-1);
        expect(firstIndex).to.be.equal(lastIndex);
    });

    it('should not add tech to dependOn if dependency matching resolving tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' },
            resolved = resolve(decl, deps, opts);

        expect(resolved.dependOn).to.be.empty;
    });
});
