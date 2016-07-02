'use strict';

const path = require('path');
const test = require('ava');
const mock = require('mock-fs');
const mockFsHelper = require(path.join(__dirname, 'lib', 'mock-fs-helper'));
const bemConfig = require('..');
const nodeModules = mockFsHelper.duplicateFSInMemory(path.resolve('..', 'node_modules'));

const initialCwd = process.cwd();

test.afterEach(() => {
    mock.restore();
    process.chdir(initialCwd);
});

test('should return empty configs', async t => {
    mock({
        node_modules: nodeModules
    });

    t.deepEqual(await bemConfig().configs(), [{}]);
});

test('should respect default config', async t => {
    mock({
        node_modules: nodeModules
    });

    const config = bemConfig({ config: { def: true } });
    const all = await config.configs();

    t.deepEqual(all, [{ def: true }]);
});

test('should override default config with .bemrc', async t => {
    const bemrc = {
        levels: {
            level1: {
                something: true
            }
        }
    };

    mock({
        node_modules: nodeModules,
        cwd: {
            level1: {}
        },
        '.bemrc': JSON.stringify(bemrc)
    });

    process.chdir('cwd');

    const conf = {
        levels: {
            level1: {
                default: true
            }
        }
    };

    const expected = Object.keys(bemrc.levels).reduce((prev, levelPath) => {
        prev[path.resolve(levelPath)] = bemrc.levels[levelPath];
        delete prev[levelPath];
        return prev;
    }, {});

    const actualResult = await bemConfig({ config: conf }).levelMapSync();

    t.deepEqual(actualResult, expected);
});

test('should not mutate defaults', async t => {
    mock({
        node_modules: nodeModules,
        level1: {}
    });

    const conf = {
        levels: {
            level1: {
                default: true
            }
        }
    };

    const before = JSON.stringify(conf);

    const actualResult = await bemConfig({ config: conf }).levelMapSync();

    const after = JSON.stringify(conf);

    t.is(before, after);
});

test('should respect argv config as CLI arg', async t => {
    mock({
        node_modules: nodeModules,
        'argv.config': '{"argv": true}'
    });

    process.argv.push('--config=argv.config');

    const config = bemConfig({ config: { def: true } });
    const all = await config.configs();

    t.deepEqual(all, [{ def: true }, { argv: true, __source: 'argv.config' }]);
});

test('should respect argv config as JS API option', async t => {
    mock({
        node_modules: nodeModules,
        'argv.config': '{"argv": true}'
    });

    const config = bemConfig({ config: { def: true }, pathToConfig: 'argv.config' });
    const all = await config.configs();

    t.deepEqual(all, [{ def: true }, { argv: true, __source: 'argv.config' }]);
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

    const config = bemConfig({ projectRoot: '../prjRoot' });
    const levelOpts = await config.level('level1');

    t.deepEqual(levelOpts, { l1o1: 'l1v1', l1o2: 'l1v2' });
});

test('should return undefined if no config found', async t => {
    mock({ node_modules: nodeModules });

    const config = bemConfig();
    const levelOpts = await config.level('no-such-level');

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

    const config = bemConfig();
    const levelOpts = await config.level('level1');

    t.deepEqual(levelOpts, { common: 'value' });
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

    const config = bemConfig();
    const levelOpts = await config.level('level1');

    t.deepEqual(levelOpts, { l1o1: 'l1v1' });
});

test('should resolve levels keys sync', t => {
    mock({
        node_modules: nodeModules,
        cwd: {
            level1: {}
        },
        '.bemrc': '{ "levels": { "level1": { "l1o1": "l1v1" } } }'
    });

    process.chdir('cwd');

    const config = bemConfig();
    const levelOpts = config.levelSync('level1');

    t.deepEqual(levelOpts, { l1o1: 'l1v1' });
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

    const config = bemConfig();
    const levelOpts = await config.level('/level1');

    t.deepEqual(levelOpts, { l1o1: 'l1v1' });
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

    const config = bemConfig();
    const levelOpts = await config.level('.');

    t.deepEqual(levelOpts, { l1o1: 'l1v1' });
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

    const config = bemConfig();
    const levelOpts = await config.level('level1');

    t.deepEqual(levelOpts, {
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

    const config = bemConfig();
    const levelOpts = await config.level('level1');

    t.deepEqual(levelOpts, {
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

    const config = bemConfig();
    const levelOpts = await config.level('level1');

    t.deepEqual(levelOpts, {
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

    const config = bemConfig();
    const level1Opts = await config.level('level1');
    const level2Opts = await config.level('level2');

    t.deepEqual(level1Opts, {
        anyLevel: 'any-value'
    });

    t.deepEqual(level2Opts, {
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

    const config = bemConfig();
    const levelOpts = await config.level('level1');

    t.deepEqual(levelOpts, { techs: ['bemhtml'] });
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

    const config = bemConfig({
        config: {
            levels: {
                level1: {
                    techsTemplates: {
                        bemhtml: 'bem-xjst'
                    }
                }
            }
        }});
    const levelOpts = await config.level('level1');

    t.deepEqual(levelOpts, {
        techsTemplates: {
            css: 'css',
            js: 'js-ymodules',
            bemhtml: 'bem-xjst'
        }
    });
});

// module()
test('should return undefined if no module found in config', async t => {
    mock({
        node_modules: nodeModules
    });

    process.chdir('/');

    const config = bemConfig();
    const moduleOpts = await config.module('no-such-module');

    t.deepEqual(moduleOpts, undefined);
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

    const config = bemConfig();
    const moduleOpts = await config.module('bem-tools');

    t.deepEqual(moduleOpts, {
        plugins: {}
    });
});

test('should return module options sync', t => {
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

    const config = bemConfig();
    const moduleOpts = config.moduleSync('bem-tools');

    t.deepEqual(moduleOpts, {
        plugins: {}
    });
});

// library()
test('should support library helper', async t => {
    mock({
        node_modules: nodeModules,
        cwd: {
            libs: {
                lib1: {
                    'common.blocks': {},
                    'desktop.blocks': {},
                    'touch.blocks': {},
                    '.bemrc': JSON.stringify({
                        levels: {
                            'common.blocks': {
                                scheme: 'nested'
                            },
                            'desktop.blocks': {
                                scheme: 'flex'
                            },
                            'touch.blocks': {
                                scheme: 'flat'
                            }
                        },
                        sets: {
                            desktop: ['common.blocks', 'desktop.blocks'],
                            touch: ['common.blocks', 'touch.blocks']
                        }
                    })
                }
            },
            '.bemrc': JSON.stringify({
                libs: {
                    lib1: {
                        path: 'libs/lib1'
                    }
                }
            })
        }
    });

    process.chdir('cwd');

    const config = bemConfig();
    const library = await config.library('lib1');
    const libConf = await library.get();
    const commonConf = await library.level('common.blocks');

    t.deepEqual(libConf.sets.touch, ['common.blocks', 'touch.blocks']);
    t.is(commonConf.scheme, 'nested');
});

test('should support library helper sync', t => {
    mock({
        node_modules: nodeModules,
        cwd: {
            libs: {
                lib1: {
                    'common.blocks': {},
                    'desktop.blocks': {},
                    'touch.blocks': {},
                    '.bemrc': JSON.stringify({
                        levels: {
                            'common.blocks': {
                                scheme: 'nested'
                            },
                            'desktop.blocks': {
                                scheme: 'flex'
                            },
                            'touch.blocks': {
                                scheme: 'flat'
                            }
                        },
                        sets: {
                            desktop: ['common.blocks', 'desktop.blocks'],
                            touch: ['common.blocks', 'touch.blocks']
                        }
                    })
                }
            },
            '.bemrc': JSON.stringify({
                libs: {
                    lib1: {
                        path: 'libs/lib1'
                    }
                }
            })
        }
    });

    process.chdir('cwd');

    const config = bemConfig();
    const library = config.librarySync('lib1');
    const libConf = library.getSync();
    const commonConf = library.levelSync('common.blocks');

    t.deepEqual(libConf.sets.touch, ['common.blocks', 'touch.blocks']);
    t.is(commonConf.scheme, 'nested');
});

// levelMap()
test('should provide all levels for libs and project', async t => {
    mock({
        node_modules: nodeModules,
        cwd: {
            libs: {
                'bem-core': {
                    'common.blocks': {},
                    'desktop.blocks': {},
                    'touch.blocks': {},
                    '.bemrc': JSON.stringify({
                        levels: {
                            'common.blocks': {
                                scheme: 'bem-core nested'
                            },
                            'desktop.blocks': {
                                scheme: 'bem-core flex'
                            },
                            'touch.blocks': {
                                scheme: 'bem-core flat'
                            }
                        },
                        sets: {
                            desktop: ['common.blocks', 'desktop.blocks'],
                            touch: ['common.blocks', 'touch.blocks']
                        }
                    })
                },
                'bem-components': {
                    'common.blocks': {},
                    'desktop.blocks': {},
                    'touch.blocks': {},
                    design: {
                        'common.blocks': {},
                        'desktop.blocks': {},
                        'touch.blocks': {}
                    },
                    '.bemrc': JSON.stringify({
                        levels: {
                            'common.blocks': {
                                scheme: 'bem-components nested'
                            },
                            'desktop.blocks': {
                                scheme: 'bem-components flex'
                            },
                            'touch.blocks': {
                                scheme: 'bem-components flat'
                            },
                            'design/common.blocks': {
                                scheme: 'bem-components nested'
                            },
                            'design/desktop.blocks': {
                                scheme: 'bem-components nested'
                            },
                            'design/touch.blocks': {
                                scheme: 'bem-components nested'
                            }
                        },
                        sets: {
                            desktop: ['common.blocks', 'desktop.blocks', 'design/common.blocks', 'design/desktop.blocks'],
                            touch: ['common.blocks', 'touch.blocks', 'design/common.blocks', 'design/touch.blocks']
                        }
                    })
                }
            },
            'common.blocks': {},
            'desktop.blocks': {},
            '.bemrc': JSON.stringify({
                libs: {
                    'bem-core': {
                        path: 'libs/bem-core'
                    },
                    'bem-components': {
                        path: 'libs/bem-components'
                    }
                },
                levels: {
                    'common.blocks': { scheme: 'project' },
                    'desktop.blocks': { scheme: 'project' }
                }
            })
        }
    });

    process.chdir('cwd');

    const config = bemConfig();
    const levelMap = await config.levelMap();
    const mockData = {
        'libs/bem-core/common.blocks': { scheme: 'bem-core nested' },
        'libs/bem-core/desktop.blocks': { scheme: 'bem-core flex' },
        'libs/bem-core/touch.blocks': { scheme: 'bem-core flat' },
        'libs/bem-components/common.blocks': { scheme: 'bem-components nested' },
        'libs/bem-components/desktop.blocks': { scheme: 'bem-components flex' },
        'libs/bem-components/touch.blocks': { scheme: 'bem-components flat' },
        'libs/bem-components/design/common.blocks': { scheme: 'bem-components nested' },
        'libs/bem-components/design/desktop.blocks': { scheme: 'bem-components nested' },
        'libs/bem-components/design/touch.blocks': { scheme: 'bem-components nested' },
        'common.blocks': { scheme: 'project' },
        'desktop.blocks': { scheme: 'project' }
    };

    const expected = Object.keys(mockData).reduce((prev, levelPath) => {
        prev[path.resolve(levelPath)] = mockData[levelPath];
        delete prev[levelPath];
        return prev;
    }, {});

    t.deepEqual(levelMap, expected);
});

test('should provide all levels for libs and project sync', t => {
    mock({
        node_modules: nodeModules,
        cwd: {
            libs: {
                'bem-core': {
                    'common.blocks': {},
                    'desktop.blocks': {},
                    'touch.blocks': {},
                    '.bemrc': JSON.stringify({
                        levels: {
                            'common.blocks': {
                                scheme: 'bem-core nested'
                            },
                            'desktop.blocks': {
                                scheme: 'bem-core flex'
                            },
                            'touch.blocks': {
                                scheme: 'bem-core flat'
                            }
                        },
                        sets: {
                            desktop: ['common.blocks', 'desktop.blocks'],
                            touch: ['common.blocks', 'touch.blocks']
                        }
                    })
                },
                'bem-components': {
                    'common.blocks': {},
                    'desktop.blocks': {},
                    'touch.blocks': {},
                    design: {
                        'common.blocks': {},
                        'desktop.blocks': {},
                        'touch.blocks': {}
                    },
                    '.bemrc': JSON.stringify({
                        levels: {
                            'common.blocks': {
                                scheme: 'bem-components nested'
                            },
                            'desktop.blocks': {
                                scheme: 'bem-components flex'
                            },
                            'touch.blocks': {
                                scheme: 'bem-components flat'
                            },
                            'design/common.blocks': {
                                scheme: 'bem-components nested'
                            },
                            'design/desktop.blocks': {
                                scheme: 'bem-components nested'
                            },
                            'design/touch.blocks': {
                                scheme: 'bem-components nested'
                            }
                        },
                        sets: {
                            desktop: ['common.blocks', 'desktop.blocks', 'design/common.blocks', 'design/desktop.blocks'],
                            touch: ['common.blocks', 'touch.blocks', 'design/common.blocks', 'design/touch.blocks']
                        }
                    })
                }
            },
            'common.blocks': {},
            'desktop.blocks': {},
            '.bemrc': JSON.stringify({
                libs: {
                    'bem-core': {
                        path: 'libs/bem-core'
                    },
                    'bem-components': {
                        path: 'libs/bem-components'
                    }
                },
                levels: {
                    'common.blocks': { scheme: 'project' },
                    'desktop.blocks': { scheme: 'project' }
                }
            })
        }
    });

    process.chdir('cwd');

    const config = bemConfig();
    const levelMap = config.levelMapSync();
    const mockData = {
        'libs/bem-core/common.blocks': { scheme: 'bem-core nested' },
        'libs/bem-core/desktop.blocks': { scheme: 'bem-core flex' },
        'libs/bem-core/touch.blocks': { scheme: 'bem-core flat' },
        'libs/bem-components/common.blocks': { scheme: 'bem-components nested' },
        'libs/bem-components/desktop.blocks': { scheme: 'bem-components flex' },
        'libs/bem-components/touch.blocks': { scheme: 'bem-components flat' },
        'libs/bem-components/design/common.blocks': { scheme: 'bem-components nested' },
        'libs/bem-components/design/desktop.blocks': { scheme: 'bem-components nested' },
        'libs/bem-components/design/touch.blocks': { scheme: 'bem-components nested' },
        'common.blocks': { scheme: 'project' },
        'desktop.blocks': { scheme: 'project' }
    };

    const expected = Object.keys(mockData).reduce((prev, levelPath) => {
        prev[path.resolve(levelPath)] = mockData[levelPath];
        delete prev[levelPath];
        return prev;
    }, {});

    t.deepEqual(levelMap, expected);
});

test('should respect fsRoot option', async t => {
    const testFolder = path.resolve('mocks', 'should-respect-fsRoot-option', 'root');
    process.chdir(path.join(testFolder, 'cwd'));

    const config = bemConfig({ fsRoot: testFolder });
    const levelOpts = await config.level('level1');

    t.deepEqual(levelOpts, { l1o1: 'l1v1' });
});

test('should respect fsHome option', async t => {
    const testFolder = path.resolve('mocks', 'should-respect-fsHome-option');
    process.chdir(path.join(testFolder, 'root', 'cwd'));

    const config = bemConfig({ fsRoot: testFolder, fsHome: path.join(testFolder, 'homedir') });
    const levelOpts = await config.level('level1');

    t.deepEqual(levelOpts, { l1o1: 'l1v1' });
});