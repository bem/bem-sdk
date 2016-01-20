var path = require('path'),
    mock = require('mock-fs'),
    mockFsHelper = require(path.join(__dirname, 'lib', 'mock-fs-helper')),
    expect = require('chai').expect,
    Config = require('..'),

    nodeModules = mockFsHelper.duplicateFSInMemory(path.resolve('node_modules'));

describe('bem-config', function() {

    afterEach(function () {
        mock.restore();
    });

    it('should return empty configs', function() {
        mock({
            node_modules: nodeModules
        });

        var config = new Config();

        expect([{}]).eql(config.configs);
    });

    it('should respect default config', function() {
        mock({
            node_modules: nodeModules
        });

        var config = new Config({ def: true });

        expect([{ def: true }]).eql(config.configs);
    });

    it('should respect argv config', function() {
        mock({
            node_modules: nodeModules,
            'argv.config': '{"argv": true}'
        });

        process.argv.push('--config=argv.config');

        var config = new Config({ def: true });

        expect([{ def: true }, { argv: true, __source: 'argv.config' }]).eql(config.configs);
    });

    describe('getLevelOpts', function() {
        it('should return undefined if no config found', function() {
            mock({ node_modules: nodeModules });

            var config = new Config(),
                levelOpts = config.getLevelOpts('no-such-level');

            expect(levelOpts).eql(undefined);
        });

        it('should return common config if no levelsOpts provided', function() {
            mock({
                node_modules: nodeModules,
                cwd: {
                    level1: {}
                },
                '.bemrc': '{ "common": "value" }'
            });

            process.chdir('cwd');

            var config = new Config(),
                levelOpts = config.getLevelOpts('level1');

            expect(levelOpts).eql({ common: 'value' });
        });

        it('should resolve levelsOpts keys', function() {
            mock({
                node_modules: nodeModules,
                cwd: {
                    level1: {}
                },
                '.bemrc': '{ "levelsOpts": { "level1": { "l1o1": "l1v1" } } }'
            });

            process.chdir('cwd');

            var config = new Config(),
                levelOpts = config.getLevelOpts('level1');

            expect(levelOpts).eql({ l1o1: 'l1v1' });
        });

        it('should return level config extended with common if matched levelsOpts key', function() {
            mock({
                node_modules: nodeModules,
                parent: {
                    cwd: {
                        level1: {}
                    },
                    '.bemrc': '{ "levelsOpts": { "level1": { "l1o1": "l1v1" } } }',
                },
                '.bemrc': JSON.stringify({
                    levelsOpts: {
                        level1: { l1o2: 'l1v2' }
                    },
                    common: 'value'
                })
            });

            process.chdir('parent/cwd');

            var config = new Config(),
                levelOpts = config.getLevelOpts('level1');

            expect(levelOpts).eql({
                l1o1: 'l1v1',
                l1o2: 'l1v2',
                common: 'value'
            });
        });

        it('should go top to project root looking for levelsOpts', function() {
            mock({
                node_modules: nodeModules,
                parent: {
                    cwd: {
                        level1: {}
                    },
                    '.bemrc': '{ "levelsOpts": { "level1": { "l1o1": "l1v1" } } }',
                },
                '.bemrc': JSON.stringify({
                    levelsOpts: {
                        level1: { l1o2: 'l1v2' }
                    },
                    root: true
                })
            });

            process.chdir('parent/cwd');

            var config = new Config(),
                levelOpts = config.getLevelOpts('level1');

            expect(levelOpts).eql({
                l1o1: 'l1v1',
                l1o2: 'l1v2'
            });
        });

        it('should not extend with configs higher then root', function() {
            mock({
                node_modules: nodeModules,
                grandParent: {
                    parent: {
                        cwd: {
                            level1: {}
                        },
                        '.bemrc': '{ "levelsOpts": { "level1": { "l1o1": "l1v1" } } }',
                    },
                    '.bemrc': JSON.stringify({
                        levelsOpts: {
                            level1: { l1o2: 'l1v2' }
                        },
                        root: true
                    })
                },
                '.bemrc': JSON.stringify({
                    levelsOpts: {
                        level1: { l1o3: 'l1v3' }
                    },
                    common: 'value'
                })
            });

            process.chdir('grandParent/parent/cwd');

            var config = new Config(),
                levelOpts = config.getLevelOpts('level1');

            expect(levelOpts).eql({
                l1o1: 'l1v1',
                l1o2: 'l1v2'
            });
        });

        it('should support wildcards for levelsOpts keys', function() {
            mock({
                node_modules: nodeModules,
                cwd: {
                    level1: {},
                    level2: {}
                },
                '.bemrc': '{ "levelsOpts": { "level*": { "anyLevel": "any-value" } } }'
            });

            process.chdir('cwd');

            var config = new Config(),
                levelOpts = config.getLevelOpts('level1');

            expect(levelOpts).eql({
                anyLevel: 'any-value'
            });
        });

        it('should use last occurrence of array option', function() {
            mock({
                node_modules: nodeModules,
                parent: {
                    cwd: {
                        level1: {}
                    },
                    '.bemrc': '{ "levelsOpts": { "level1": { "techs": ["bemhtml"] } } }'
                },
                '.bemrc': '{ "levelsOpts": { "level1": { "techs": ["css", "js"] } } }'
            });

            process.chdir('parent/cwd');

            var config = new Config(),
                levelOpts = config.getLevelOpts('level1');

            expect(levelOpts).eql({
                techs: ['bemhtml']
            });
        });

        it('should extend hash option by each upper config', function() {
            mock({
                node_modules: nodeModules,
                parent: {
                    cwd: {
                        level1: {}
                    },
                    '.bemrc': JSON.stringify({
                        levelsOpts: {
                            level1: {
                                techsTemplates: {
                                    js: 'js-ymodules'
                                }
                            }
                        }
                    })
                },
                '.bemrc': JSON.stringify({
                    levelsOpts: {
                        level1: {
                            techsTemplates: {
                                css: 'css'
                            }
                        }
                    }
                })
            });

            process.chdir('parent/cwd');

            var config = new Config({
                levelsOpts: {
                    level1: {
                        techsTemplates: {
                            bemhtml: 'bem-xjst'
                        }
                    }
                }}),
                levelOpts = config.getLevelOpts('level1');

            expect(levelOpts).eql({
                techsTemplates: {
                    css: 'css',
                    js: 'js-ymodules',
                    bemhtml: 'bem-xjst'
                }
            });
        });
    });
});
