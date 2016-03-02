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

    describe('getLevel', function() {
        it('should return undefined if no config found', function() {
            mock({ node_modules: nodeModules });

            var config = new Config(),
                levelOpts = config.getLevel('no-such-level');

            expect(levelOpts).eql(undefined);
        });

        it('should return common config if no levels provided', function() {
            mock({
                node_modules: nodeModules,
                cwd: {
                    level1: {}
                },
                '.bemrc': '{ "common": "value" }'
            });

            process.chdir('cwd');

            var config = new Config(),
                levelOpts = config.getLevel('level1');

            expect(levelOpts).eql({ common: 'value' });
        });

        it('should resolve levels keys', function() {
            mock({
                node_modules: nodeModules,
                cwd: {
                    level1: {}
                },
                '.bemrc': '{ "levels": { "level1": { "l1o1": "l1v1" } } }'
            });

            process.chdir('cwd');

            var config = new Config(),
                levelOpts = config.getLevel('level1');

            expect(levelOpts).eql({ l1o1: 'l1v1' });
        });

        it('should respect absolute path', function() {
            mock({
                node_modules: nodeModules,
                cwd: {
                    level1: {}
                },
                '.bemrc': '{ "levels": { "/level1": { "l1o1": "l1v1" } } }'
            });

            process.chdir('cwd');

            var config = new Config(),
                levelOpts = config.getLevel('/level1');

            expect(levelOpts).eql({ l1o1: 'l1v1' });
        });

        it('should respect "." path', function() {
            mock({
                node_modules: nodeModules,
                cwd: {
                    level1: {}
                },
                '.bemrc': '{ "levels": { ".": { "l1o1": "l1v1" } } }'
            });

            process.chdir('cwd');

            var config = new Config(),
                levelOpts = config.getLevel('.');

            expect(levelOpts).eql({ l1o1: 'l1v1' });
        });

        it('should return level config extended with common if matched levels key', function() {
            mock({
                node_modules: nodeModules,
                parent: {
                    cwd: {
                        level1: {}
                    },
                    '.bemrc': '{ "levels": { "level1": { "l1o1": "l1v1" } } }',
                },
                '.bemrc': JSON.stringify({
                    levels: {
                        level1: { l1o2: 'l1v2' }
                    },
                    common: 'value'
                })
            });

            process.chdir('parent/cwd');

            var config = new Config(),
                levelOpts = config.getLevel('level1');

            expect(levelOpts).eql({
                l1o1: 'l1v1',
                l1o2: 'l1v2',
                common: 'value'
            });
        });

        it('should go top to project root looking for levels', function() {
            mock({
                node_modules: nodeModules,
                parent: {
                    cwd: {
                        level1: {}
                    },
                    '.bemrc': '{ "levels": { "level1": { "l1o1": "l1v1" } } }',
                },
                '.bemrc': JSON.stringify({
                    levels: {
                        level1: { l1o2: 'l1v2' }
                    },
                    root: true
                })
            });

            process.chdir('parent/cwd');

            var config = new Config(),
                levelOpts = config.getLevel('level1');

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
                        '.bemrc': '{ "levels": { "level1": { "l1o1": "l1v1" } } }',
                    },
                    '.bemrc': JSON.stringify({
                        levels: {
                            level1: { l1o2: 'l1v2' }
                        },
                        root: true
                    })
                },
                '.bemrc': JSON.stringify({
                    levels: {
                        level1: { l1o3: 'l1v3' }
                    },
                    common: 'value'
                })
            });

            process.chdir('grandParent/parent/cwd');

            var config = new Config(),
                levelOpts = config.getLevel('level1');

            expect(levelOpts).eql({
                l1o1: 'l1v1',
                l1o2: 'l1v2'
            });
        });

        it('should support wildcards for levels keys', function() {
            mock({
                node_modules: nodeModules,
                cwd: {
                    level1: {},
                    level2: {}
                },
                '.bemrc': '{ "levels": { "level*": { "anyLevel": "any-value" } } }'
            });

            process.chdir('cwd');

            var config = new Config(),
                level1Opts = config.getLevel('level1'),
                level2Opts = config.getLevel('level2');

            expect(level1Opts).eql({
                anyLevel: 'any-value'
            });

            expect(level2Opts).eql({
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
                    '.bemrc': '{ "levels": { "level1": { "techs": ["bemhtml"] } } }'
                },
                '.bemrc': '{ "levels": { "level1": { "techs": ["css", "js"] } } }'
            });

            process.chdir('parent/cwd');

            var config = new Config(),
                levelOpts = config.getLevel('level1');

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
                        levels: {
                            level1: {
                                techsTemplates: {
                                    js: 'js-ymodules'
                                }
                            }
                        }
                    })
                },
                '.bemrc': JSON.stringify({
                    levels: {
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
                levels: {
                    level1: {
                        techsTemplates: {
                            bemhtml: 'bem-xjst'
                        }
                    }
                }}),
                levelOpts = config.getLevel('level1');

            expect(levelOpts).eql({
                techsTemplates: {
                    css: 'css',
                    js: 'js-ymodules',
                    bemhtml: 'bem-xjst'
                }
            });
        });
    });

    describe('getModule', function() {
        it('should return undefined if no module found in config', function() {
            mock({
                node_modules: nodeModules
            });

            process.chdir('/');

            var config = new Config(),
                moduleOpts = config.getModule('no-such-module');

            expect(moduleOpts).eql(undefined);
        });

        it('should return module options', function() {
            mock({
                node_modules: nodeModules,
                cwd: {},
                '.bemrc': JSON.stringify({
                    root: true,
                    levels: {
                        'path/to/level': {
                            scheme: 'nested'
                        }
                    },
                    modules: {
                        'bem-tools': {
                            plugins: {}
                        }
                    }
                })
            });

            process.chdir('cwd');

            var config = new Config(),
                moduleOpts = config.getModule('bem-tools');

            expect(moduleOpts).eql({
                plugins: {}
            });
        });
    });
});
