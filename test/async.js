'use strict';

const path = require('path');
const test = require('ava');
const proxyquire = require('proxyquire');
const notStubbedBemConfig = require('..');

function config(conf) {
    return proxyquire('..', {
        'betterc': function() {
            return Promise.resolve(conf || [{}]);
        }
    });
}

// configs()
test('should return empty config', async t => {
    const bemConfig = config();

    const actual = await bemConfig().configs();

    t.deepEqual(actual, [{}]);
});

test('should return empty config if empty map passed', async t => {
    const bemConfig = config([{}]);

    const actual = await bemConfig().configs();

    t.deepEqual(actual, [{}]);
});

test('should return configs', async t => {
    const bemConfig = config([
        { test: 1 },
        { test: 2 }
    ]);

    const actual = await bemConfig().configs();

    t.deepEqual(actual, [{ test: 1 }, { test: 2 }]);
});

// root()
test('should return project root', async t => {
    const bemConfig = config([
        { test: 1, __source: 'some/path' },
        { test: 2, root: true, __source: __filename },
        { other: 'field', __source: 'some/other/path' }
    ]);

    const actual = await bemConfig().root();

    t.deepEqual(actual, path.dirname(__filename));
});

// get()
test('should return merged config', async t => {
    const bemConfig = config([
        { test: 1 },
        { test: 2 },
        { other: 'field' }
    ]);

    const actual = await bemConfig().get();

    t.deepEqual(actual, { test: 2, other: 'field' });
});

// level()
test('should return undefined if no levels in config', async t => {
    const bemConfig = config();

    const actual = await bemConfig().level('l1');

    t.is(actual, undefined);
});

test('should return undefined if no level found', async t => {
    const bemConfig = config([
        {
            levels: {
                l1: {
                    some: 'conf'
                }
            }
        }
    ]);

    const actual = await bemConfig().level('l2');

    t.is(actual, undefined);
});

test('should return level if no __source provided', async t => {
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

    const actual = await bemConfig().level('path/to/level');

    t.deepEqual(actual, { test: 1, something: 'else' });
});

test('should return level with __source', async t => {
    const bemConfig = config([
        {
            levels: {
                'path/to/level': {
                    test: 1
                }
            },
            something: 'else',
            __source: path.join(process.cwd(), path.basename(__filename))
        }
    ]);

    const actual = await bemConfig().level('path/to/level');

    t.deepEqual(actual, { test: 1, something: 'else' });
});

test('should resolve wildcard levels', async t => {
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

    const actual1 = await bemConfig({ cwd: path.resolve(__dirname, 'mocks')})
        .level('level1');

    t.deepEqual(actual1, { test: 1, something: 'else' });

    const actual2 = await bemConfig({ cwd: path.resolve(__dirname, 'mocks')})
        .level('level2');

    t.deepEqual(actual2, { test: 1, something: 'else' });
});

test('should resolve wildcard levels with absolute path', async t => {
    const conf = {
        levels: {},
        something: 'else'
    };
    conf.levels[path.join(__dirname, 'mocks', 'l*')] = { test: 1 };
    const bemConfig = config([conf]);

    t.deepEqual(await bemConfig({ cwd: path.resolve(__dirname, 'mocks')})
        .level('level1'), { test: 1, something: 'else' });
});


test('should return globbed levels map', async t => {
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

    const actual = await bemConfig().levelMap();

    t.deepEqual(actual, expected);
});

test('should respect absolute path for level', async t => {
    const bemConfig = config([
        {
            levels: {
                '/path/to/level': {
                    test: 1
                }
            },
            something: 'else'
        }
    ]);

    const actual = await bemConfig().level('/path/to/level');

    t.deepEqual(actual, { test: 1, something: 'else' });
});

test('should respect "." path', async t => {
    const bemConfig = config([
        {
            levels: {
                '.': {
                    test: 1
                }
            },
            something: 'else'
        }
    ]);

    const actual = await bemConfig().level('.');

    t.deepEqual(actual, { test: 1, something: 'else' });
});

test('should return extended level config merged from different configs', async t => {
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

    const actual = await bemConfig().level('level1');

    const expected = {
        l1o1: 'l1v1',
        l1o2: 'l1v2',
        common: 'value'
    };

    t.deepEqual(actual, expected);
});

test('should not extend with configs higher then root', async t => {
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

    const actual = await bemConfig().level('level1');

    t.deepEqual(actual, { something: 'from root level', l1o1: 'should win' });
});

// test.skip('should use last occurrence of array option', async t => {

// });

// test.skip('should respect extend for options', async t => {

// });

// levelMap()
test('should return empty map on levelMap if no levels found', async t => {
    const bemConfig = config();

    const actual = await bemConfig().levelMap();

    t.deepEqual(actual, {});
});

test('should return levels map', async t => {
    const bemConfig = config([{
        levels: {
            l1: {
                some: 'conf1'
            }
        },
        libs: {
            lib1: {
                levels: {
                    l1: {
                        some: 'conf1'
                    }
                }
            }
        }
    }]);

    const actual = await bemConfig().levelMap();

    const expected = {};
    expected[path.resolve('l1')] = { some: 'conf1' };

    // because of mocked rc, all instances of bemConfig has always the same data
    t.deepEqual(actual, expected);
});

// library()
test('should return undefined if no libs in config', async t => {
    const bemConfig = config();

    const actual = await bemConfig().library('lib1');

    t.is(actual, undefined);
});

test('should return undefined if no library found', async t => {
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

    const actual = await bemConfig().library('lib2');

    t.is(actual, undefined);
});

test('should return library config', async t => {
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

    const lib = await bemConfig().library('lib1');

    const libConf = await lib.get();

    // because of mocked rc, all instances of bemConfig has always the same data
    t.deepEqual(libConf, conf[0]);
});

// module()
test('should return undefined if no modules in config', async t => {
    const bemConfig = config();

    const actual = await bemConfig().module('m1');

    t.is(actual, undefined);
});

test('should return undefined if no module found', async t => {
    const bemConfig = config([
        {
            modules: {
                m1: {
                    conf: 'of m1'
                }
            }
        }
    ]);

    const actual = await bemConfig().module('m2');

    t.is(actual, undefined);
});

test('should return module', async t => {
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

    const actual = await bemConfig().module('m1');

    t.deepEqual(actual, { conf: 'of m1' });
});

test('should respect rc options', async t => {
    const pathToConfig = path.resolve(__dirname, 'mocks', 'argv-conf.json');
    const opts = {
        defaults: { conf: 'def' },
        pathToConfig: pathToConfig,
        fsRoot: process.cwd(),
        fsHome: process.cwd()
    };

    const actual = await notStubbedBemConfig(opts).get();

    const expected = { conf: 'def', argv: true, __source: pathToConfig };

    t.deepEqual(actual, expected);
});

// TODO: add test for
// resolving, e.g. projectRoot
// 'should override default config with .bemrc'
// 'should not override default levels if none in .bemrc provided'
// 'should not mutate defaults'

test('should return common config if no levels provided', async t => {
    const bemConfig = config([
        { common: 'value' }
    ]);

    const actual = await bemConfig().level('level1');

    t.deepEqual(actual, { common: 'value' });
});

test('should respect extendedBy from rc options', async t => {
    const pathToConfig = path.resolve(__dirname, 'mocks', 'argv-conf.json');
    const actual = await notStubbedBemConfig({
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
    }).level('path/to/level');

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
