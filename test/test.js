var path = require('path'),
    test = require('ava'),
    mock = require('mock-fs'),
    mockFsHelper = require(path.join(__dirname, 'lib', 'mock-fs-helper')),
    Config = require('..'),

    nodeModules = mockFsHelper.duplicateFSInMemory(path.resolve('..', 'node_modules'));

test.afterEach(function () {
    mock.restore();
});

test('should return empty configs', async t => {
    mock({
        node_modules: nodeModules
    });

    t.same(await Config().getAll(), { configs: [{}], merged: {} });
});

test('should respect default config', async t => {
    mock({
        node_modules: nodeModules
    });

    var config = Config({ config: { def: true } }),
        all = await config.getAll();

    t.same(all.configs, [{ def: true }]);
    t.same(all.merged, { def: true });
});

test('should respect argv config', async t => {
    mock({
        node_modules: nodeModules,
        'argv.config': '{"argv": true}'
    });

    process.argv.push('--config=argv.config');

    var config = Config({ config: { def: true } }),
        all = await config.getAll();

    t.same(all.configs, [{ def: true }, { argv: true, __source: 'argv.config' }]);
});

test('should respect projectRoot option', async t => {
    mock({
        node_modules: nodeModules,
        prjRoot: {
            '.bemrc': '{ "levels": { "level1": { "l1o1": "l1v1" } } }',
            level1: {}
        },
        cwd: {
            '.bemrc': '{ "levels": { "level1": { "thisDoesNotAffect": "result" } } }',
            level1: {}
        },
        '.bemrc': '{ "levels": { "level1": { "l1o2": "l1v2" } } }'
    });

    process.chdir('cwd');

    var config = Config({ projectRoot: '../prjRoot' }),
        levelOpts = await config.getConfig('level1');

    t.same(levelOpts, { l1o1: 'l1v1', l1o2: 'l1v2' });
});

// getConfig
test('should return undefined if no config found', async t => {
    mock({ node_modules: nodeModules });

    var config = Config(),
        levelOpts = await config.getConfig('no-such-level');

    t.is(levelOpts, undefined);
});

test('should return common config if no levels provided', async t => {
    mock({
        node_modules: nodeModules,
        cwd: {
            level1: {}
        },
        '.bemrc': '{ "common": "value" }'
    });

    process.chdir('cwd');

    var config = Config(),
        levelOpts = await config.getConfig('level1');

    t.same(levelOpts, { common: 'value' });
});

test('should resolve levels keys', async t => {
    mock({
        node_modules: nodeModules,
        cwd: {
            level1: {}
        },
        '.bemrc': '{ "levels": { "level1": { "l1o1": "l1v1" } } }'
    });

    process.chdir('cwd');

    var config = Config(),
        levelOpts = await config.getConfig('level1');

    t.same(levelOpts, { l1o1: 'l1v1' });
});

test('should respect absolute path', async t => {
    mock({
        node_modules: nodeModules,
        cwd: {
            level1: { thisDoesNotAffect: 'result' }
        },
        '.bemrc': '{ "levels": { "/level1": { "l1o1": "l1v1" } } }'
    });

    process.chdir('cwd');

    var config = Config(),
        levelOpts = await config.getConfig('/level1');

    t.same(levelOpts, { l1o1: 'l1v1' });
});

test('should respect "." path', async t => {
    mock({
        node_modules: nodeModules,
        cwd: {
            level1: {}
        },
        '.bemrc': '{ "levels": { ".": { "l1o1": "l1v1" } } }'
    });

    process.chdir('cwd');

    var config = Config(),
        levelOpts = await config.getConfig('.');

    t.same(levelOpts, { l1o1: 'l1v1' });
});

test('should return level config extended with common if matched levels key', async t => {
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

    var config = Config(),
        levelOpts = await config.getConfig('level1');

    t.same(levelOpts, {
        l1o1: 'l1v1',
        l1o2: 'l1v2',
        common: 'value'
    });
});

test('should go top to project root looking for levels', async t => {
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

    var config = Config(),
        levelOpts = await config.getConfig('level1');

    t.same(levelOpts, {
        l1o1: 'l1v1',
        l1o2: 'l1v2'
    });
});

test('should not extend with configs higher then root', async t => {
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

    var config = Config(),
        levelOpts = await config.getConfig('level1');

    t.same(levelOpts, {
        l1o1: 'l1v1',
        l1o2: 'l1v2'
    });
});

test('should support wildcards for levels keys', async t => {
    mock({
        node_modules: nodeModules,
        cwd: {
            level1: {},
            level2: {}
        },
        '.bemrc': '{ "levels": { "level*": { "anyLevel": "any-value" } } }'
    });

    process.chdir('cwd');

    var config = Config(),
        level1Opts = await config.getConfig('level1'),
        level2Opts = await config.getConfig('level2');

    t.same(level1Opts, {
        anyLevel: 'any-value'
    });

    t.same(level2Opts, {
        anyLevel: 'any-value'
    });
});

test('should use last occurrence of array option', async t => {
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

    var config = Config(),
        levelOpts = await config.getConfig('level1');

    t.same(levelOpts, { techs: ['bemhtml'] });
});

test('should extend hash option by each upper config', async t => {
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

    var config = Config({
        config: {
            levels: {
                level1: {
                    techsTemplates: {
                        bemhtml: 'bem-xjst'
                    }
                }
            }
        }}),
        levelOpts = await config.getConfig('level1');

    t.same(levelOpts, {
        techsTemplates: {
            css: 'css',
            js: 'js-ymodules',
            bemhtml: 'bem-xjst'
        }
    });
});

// getModuleConfig
test('should return undefined if no module found in config', async t => {
    mock({
        node_modules: nodeModules
    });

    process.chdir('/');

    var config = Config(),
        moduleOpts = await config.getModuleConfig('no-such-module');

    t.same(moduleOpts, undefined);
});

test('should return module options', async t => {
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

    var config = Config(),
        moduleOpts = await config.getModuleConfig('bem-tools');

    t.same(moduleOpts, {
        plugins: {}
    });
});
