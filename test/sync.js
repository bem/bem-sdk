'use strict';

const path = require('path');
const test = require('ava');
const proxyquire = require('proxyquire');
const notStubbedBemConfig = require('..');

// stub for bem-config
function config(conf) {
    return proxyquire('..', {
        'betterc': {
            sync: function() {
                return conf || [{}];
            }
        }
    });
}

// configs()
test('should return empty config', t => {
    const bemConfig = config();

    t.deepEqual(bemConfig().configs(true), [{}]);
});

test('should return empty config if empty map passed', t => {
    const bemConfig = config([{}]);

    t.deepEqual(bemConfig().configs(true), [{}]);
});

test('should return configs', t => {
    const bemConfig = config([
        { test: 1 },
        { test: 2 }
    ]);

    t.deepEqual(bemConfig().configs(true), [{ test: 1 }, { test: 2 }]);
});

// root()
test('should return project root', t => {
    const bemConfig = config([
        { test: 1, __source: 'some/path' },
        { test: 2, root: true, __source: __filename },
        { other: 'field', __source: 'some/other/path' }
    ]);

    t.deepEqual(bemConfig().rootSync(), path.dirname(__filename));
});

// get()
test('should return merged config', t => {
    const bemConfig = config([
        { test: 1 },
        { test: 2 },
        { other: 'field' }
    ]);

    t.deepEqual(bemConfig().getSync(), { test: 2, other: 'field' });
});

// level()
test('should return undefined if no levels in config', t => {
    const bemConfig = config();

    t.is(bemConfig().levelSync('l1'), undefined);
});

test('should return undefined if no level found', t => {
    const bemConfig = config([
        {
            levels: {
                l1: {
                    some: 'conf'
                }
            }
        }
    ]);

    t.is(bemConfig().levelSync('l2'), undefined);
});

test('should return level', t => {
    const bemConfig = config([
        {
            levels: {
                'path/to/level': {
                    test: 1
                }
            },
            something: 'else'
        }
    ]);

    t.deepEqual(bemConfig().levelSync('path/to/level'), { test: 1, something: 'else' });
});

test('should resolve wildcard levels', t => {
    const bemConfig = config([
        {
            levels: {
                'l*': {
                    test: 1
                }
            },
            something: 'else'
        }
    ]);

    t.deepEqual(bemConfig({ cwd: path.resolve(__dirname, 'mocks')})
        .levelSync('level1'), { test: 1, something: 'else' });
});

test('should resolve wildcard levels with absolute path', t => {
    const conf = {
        levels: {},
        something: 'else'
    };
    conf.levels[path.join(__dirname, 'mocks', 'l*')] = { test: 1 };
    const bemConfig = config([conf]);

    t.deepEqual(bemConfig({ cwd: path.resolve(__dirname, 'mocks')})
        .levelSync('level1'), { test: 1, something: 'else' });
});

test('should merge levels from different configs', t => {
    const bemConfig = config([
        {
            levels: {
                level1: {
                    'l1o1': 'l1v1'
                }
            },
            common: 'value'
        },
        {
            levels: {
                level1: {
                    'l1o2': 'l1v2'
                }
            }
        }
    ]);

    const expected = {
        l1o1: 'l1v1',
        l1o2: 'l1v2',
        common: 'value'
    };

    t.deepEqual(bemConfig().levelSync('level1'), expected);
});

test('should override arrays in merged levels from different configs', t => {
    const bemConfig = config([
        {
            levels: {
                level1: {
                    techs: ['css', 'js'],
                    whatever: 'you want',
                    templates: [{
                        css: 'path/to/css.js'
                    }],
                    obj: {
                        key: 'val'
                    }
                }
            },
            techs: ['md'],
            one: 2
        },
        {
            levels: {
                level1: {
                    techs: ['bemhtml'],
                    something: 'else',
                    templates: [{
                        bemhtml: 'path/to/bemhtml.js'
                    }],
                    obj: {
                        other: 'key'
                    }
                }
            }
        }
    ]);

    const expected = {
        techs: ['bemhtml'],
        something: 'else',
        whatever: 'you want',
        templates: [{
            bemhtml: 'path/to/bemhtml.js'
        }],
        obj: {
            key: 'val',
            other: 'key'
        },
        one: 2
    };

    const actual = bemConfig().levelSync('level1');

    t.deepEqual(actual, expected);
});

// levelMap()
test('should return empty map on levelMap if no levels found', t => {
    const bemConfig = config();

    t.deepEqual(bemConfig().levelMapSync(), {});
});

test('should return levels map', t => {
    const bemConfig = config([{
        levels: {
            l1: {
                some: 'conf1'
            }
        },
        libs: {
            'lib1': {
                levels: {
                    'l1': {
                        some: 'conf1'
                    }
                }
            }
        },
        __source: path.join(process.cwd(), path.basename(__filename))
    }]);

    const expected = {};
    expected[path.resolve('l1')] = { some: 'conf1' };

    const actual = bemConfig().levelMapSync();

    // because of mocked rc, all instances of bemConfig has always the same data
    t.deepEqual(actual, expected);
});

test('should return globbed levels map', t => {
    const mockDir = path.resolve(__dirname, 'mocks');
    const levelPath = path.join(mockDir, 'l*');
    const levels = {};
    levels[levelPath] = { some: 'conf1' };
    const bemConfig = config([{
        levels,
        libs: {
            'lib1': {
                levels
            }
        },
        __source: mockDir
    }]);

    const expected = {};
    expected[path.join(mockDir, 'level1')] = { some: 'conf1' };
    expected[path.join(mockDir, 'level2')] = { some: 'conf1' };

    const actual = bemConfig().levelMapSync();

    t.deepEqual(actual, expected);
});

// library()
test('should return undefined if no libs in config', t => {
    const bemConfig = config();

    t.is(bemConfig().librarySync('lib1'), undefined);
});

test('should return undefined if no library found', t => {
    const bemConfig = config([
        {
            libs: {
                'lib1': {
                    conf: 'of lib1',
                    path: 'libs/lib1'
                }
            }
        }
    ]);

    t.is(bemConfig().librarySync('lib2'), undefined);
});

test('should return library config', t => {
    const conf = [
        {
            libs: {
                'lib1': {
                    conf: 'of lib1',
                    path: 'libs/lib1'
                }
            }
        }
    ];

    const bemConfig = config(conf);

    const libConf = bemConfig().librarySync('lib1').getSync();

    // because of mocked rc, all instances of bemConfig has always the same data
    t.deepEqual(libConf, conf[0]);
});

// module()
test('should return undefined if no modules in config', t => {
    const bemConfig = config();

    t.is(bemConfig().moduleSync('m1'), undefined);
});

test('should return undefined if no module found', t => {
    const bemConfig = config([
        {
            modules: {
                m1: {
                    conf: 'of m1'
                }
            }
        }
    ]);

    t.is(bemConfig().moduleSync('m2'), undefined);
});


test('should return module', t => {
    const bemConfig = config([
        {
            modules: {
                m1: {
                    conf: 'of m1'
                },
                m2: {
                    conf: 'of m2'
                }
            }
        }
    ]);

    t.deepEqual(bemConfig().moduleSync('m1'), { conf: 'of m1' });
});

test('should not extend with configs higher then root', t => {
    const bemConfig = config([
        {
            levels: {
                level1: {
                    l1o1: 'should not be used',
                    l1o2: 'should not be used either'
                }
            }
        },
        {
            levels: {
                level1: {
                    something: 'from root level',
                    l1o1: 'should be overwritten'
                }
            },
            root: true
        },
        {
            levels: {
                level1: {
                    l1o1: 'should win'
                }
            }
        }
    ]);

    const actual = bemConfig().levelSync('level1');

    t.deepEqual(actual, { something: 'from root level', l1o1: 'should win' });
});

test('should respect rc options', t => {
    const pathToConfig = path.resolve(__dirname, 'mocks', 'argv-conf.json');
    const actual = notStubbedBemConfig({
        defaults: { conf: 'def' },
        pathToConfig: pathToConfig,
        fsRoot: process.cwd(),
        fsHome: process.cwd()
    }).getSync();

    t.deepEqual(actual, { conf: 'def', argv: true, __source: pathToConfig });
});

test('should respect extendedBy from rc options', t => {
    const pathToConfig = path.resolve(__dirname, 'mocks', 'argv-conf.json');
    const actual = notStubbedBemConfig({
        defaults: {
            levels: {
                'path/to/level': {
                    test1: 1,
                    same: 'initial'
                }
            },
            common: 'initial',
            original: 'blah'
        },
         extendBy: {
            levels: { 'path/to/level': { test2: 2, same: 'new' } },
            common: 'overriden',
            extended: 'yo'
        },
        pathToConfig: pathToConfig,
        fsRoot: process.cwd(),
        fsHome: process.cwd()
    }).levelSync('path/to/level');

    const expected = {
        test1: 1,
        test2: 2,
        same: 'new',
        common: 'overriden',
        original: 'blah',
        extended: 'yo',
        argv: true
    };

    t.deepEqual(actual, expected);
});
