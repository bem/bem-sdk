'use strict';

const path = require('path');

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

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

describe('sync', () => {
    // configs()
    it('should return empty config', () => {
        const bemConfig = config();

        expect(bemConfig().configs(true)).to.deep.equal([{}]);
    });

    it('should return empty config if empty map passed', () => {
        const bemConfig = config([{}]);

        expect(bemConfig().configs(true)).to.deep.equal([{}]);
    });

    it('should return configs', () => {
        const bemConfig = config([
            { test: 1 },
            { test: 2 }
        ]);

        expect(bemConfig().configs(true)).to.deep.equal([{ test: 1 }, { test: 2 }]);
    });

    // root()
    it('should return project root', () => {
        const bemConfig = config([
            { test: 1, __source: 'some/path' },
            { test: 2, root: true, __source: __filename },
            { other: 'field', __source: 'some/other/path' }
        ]);

        expect(bemConfig().rootSync()).to.deep.equal(path.dirname(__filename));
    });

    it('should respect proper project root', () => {
        const bemConfig = config([
            { test: 1, root: true, __source: 'some/path' },
            { test: 2, root: true, __source: __filename },
            { other: 'field', __source: 'some/other/path' }
        ]);

        expect(bemConfig().rootSync()).to.deep.equal(path.dirname(__filename));
    });

    // get()
    it('should return merged config', () => {
        const bemConfig = config([
            { test: 1 },
            { test: 2 },
            { other: 'field' }
        ]);

        expect(bemConfig().getSync()).to.deep.equal({ test: 2, other: 'field' });
    });

    // level()
    it('should return undefined if no levels in config', () => {
        const bemConfig = config();

        expect(bemConfig().levelSync('l1')).to.equal(undefined);
    });

    it('should return undefined if no level found', () => {
        const bemConfig = config([{
            levels: [
                { path: 'l1', some: 'conf' }
            ]
        }]);

        expect(bemConfig().levelSync('l2')).to.equal(undefined);
    });

    it('should return level', () => {
        const bemConfig = config([{
            levels: [
                { path: 'path/to/level', test: 1 }
            ],
            something: 'else'
        }]);

        expect(bemConfig().levelSync('path/to/level')).to.deep.equal({ test: 1, something: 'else' });
    });

    it('should resolve wildcard levels', () => {
        const bemConfig = config([{
            levels: [
                { path: 'l*', test: 1 }
            ],
            something: 'else'
        }]);

        expect(bemConfig({ cwd: path.resolve(__dirname, 'mocks') }).levelSync('level1')).to.deep.equal(
            { test: 1, something: 'else' }
        );
    });

    it('should resolve wildcard levels with absolute path', () => {
        const conf = {
            levels: [],
            something: 'else'
        };
        conf.levels.push({ path: path.join(__dirname, 'mocks', 'l*'), test: 1 });
        const bemConfig = config([conf]);

        expect(bemConfig({ cwd: path.resolve(__dirname, 'mocks') }).levelSync('level1')).to.deep.equal(
            { test: 1, something: 'else' }
        );
    });

    it('should merge levels from different configs', () => {
        const bemConfig = config([{
            levels: [
                { path: 'level1', 'l1o1': 'l1v1' }
            ],
            common: 'value'
        }, {
            levels: [
                { path: 'level1', l1o2: 'l1v2' }
            ]
        }]);

        const expected = {
            l1o1: 'l1v1',
            l1o2: 'l1v2',
            common: 'value'
        };

        expect(bemConfig().levelSync('level1')).to.deep.equal(
            expected
        );
    });

    it('should override arrays in merged levels from different configs', () => {
        const bemConfig = config([{
            levels: [
                {
                    path: 'level1',
                    techs: ['css', 'js'],
                    whatever: 'you want',
                    templates: [{
                        css: 'path/to/css.js'
                    }],
                    obj: {
                        key: 'val'
                    }
                }
            ],
            techs: ['md'],
            one: 2
        }, {
            levels: [
                {
                    path: 'level1',
                    techs: ['bemhtml'],
                    something: 'else',
                    templates: [{
                        bemhtml: 'path/to/bemhtml.js'
                    }],
                    obj: {
                        other: 'key'
                    }
                }
            ]
        }]);

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

        expect(bemConfig().levelSync('level1')).to.deep.equal(
            expected
        );
    });

    // levelMap()
    it('should return empty map on levelMap if no levels found', () => {
        const bemConfig = config();

        expect(bemConfig().levelMapSync()).to.deep.equal(
            {}
        );
    });

    it('should return levels map for project without libs', () => {
        const bemConfig = config([{
            levels: [
                { path: 'l1', some: 'conf1' }
            ],
            __source: path.join(process.cwd(), path.basename(__filename))
        }]);

        const expected = {};
        expected[path.resolve('l1')] = { path: path.resolve('l1'), some: 'conf1' };

        const actual = bemConfig().levelMapSync();

        expect(actual).to.deep.equal(expected);
    });

    it('should return proper levels map for layer without path and custom cwd', () => {
        const bemConfig = config([{
            levels: [
                { layer: 'common', some: 'conf1' }
            ],
            __source: path.join(process.cwd(), path.basename(__filename))
        }]);

        const expected = {};
        expected[path.resolve('src', 'common.blocks')] = {
            path: path.resolve('src', 'common.blocks'),
            some: 'conf1',
            layer: 'common'
        };

        const actual = bemConfig({ cwd: path.resolve('src') }).levelMapSync();

        expect(actual).to.deep.equal(expected);
    });

    it('should return proper levels map for layer without path and custom cwd', () => {
        const bemConfig = config([{
            levels: [
                { layer: 'common', some: 'conf1' }
            ],
            __source: path.join(process.cwd(), path.basename(__filename))
        }]);

        const expected = {};
        expected[path.resolve('..', 'common.blocks')] = {
            path: path.resolve('..', 'common.blocks'),
            some: 'conf1',
            layer: 'common'
        };

        const actual = bemConfig({ cwd: path.resolve('..') }).levelMapSync();

        expect(actual).to.deep.equal(expected);
    });

    it('should return levels map for project and included libs', () => {
        const pathToLib1 = path.resolve(__dirname, 'mocks', 'node_modules', 'lib1');
        const bemConfig = config([{
            levels: [
                { path: 'l1', some: 'conf1' }
            ],
            libs: {
                lib1: {
                    path: pathToLib1,
                    some: 'conf1'
                }
            },
            __source: path.join(process.cwd(), path.basename(__filename))
        }]);

        const expected = {};
        expected[path.resolve('l1')] = { path: path.resolve(path.resolve('l1')), some: 'conf1' };

        const actual = bemConfig().levelMapSync();

        // because of mocked rc, all instances of bemConfig has always the same data
        expect(actual).to.deep.equal(expected);
    });

    it('should return globbed levels map', () => {
        const mockDir = path.resolve(__dirname, 'mocks');
        const levelPath = path.join(mockDir, 'l*');
        const levels = [{path: levelPath, some: 'conf1'}];
        const bemConfig = config([{
            levels,
            __source: mockDir
        }]);

        const expected = {};
        expected[path.join(mockDir, 'level1')] = { path: path.join(mockDir, 'level1'), some: 'conf1' };
        expected[path.join(mockDir, 'level2')] = { path: path.join(mockDir, 'level2'), some: 'conf1' };

        const actual = bemConfig().levelMapSync();

        expect(actual).to.deep.equal(expected);
    });

    // library()
    it('should throw if lib format is incorrect', () => {
        const bemConfig = config([{
            libs: {
                lib1: ''
            }
        }]);

        expect(() => bemConfig().librarySync('lib1')).to.throw(/Invalid `libs` format/);
    });

    it('should throw if lib was not found', () => {
        const bemConfig = config();

        expect(() => bemConfig().librarySync('lib1')).to.throw(/Library lib1 was not found at /);
    });

    it('should throw if lib was not found', () => {
        const bemConfig = config([{
            libs: {
                lib1: {
                    conf: 'of lib1',
                    path: 'libs/lib1'
                }
            }
        }]);

        expect(() => bemConfig().librarySync('lib1')).to.throw(/Library lib1 was not found at /);
        expect(() => bemConfig().librarySync('lib2')).to.throw(/Library lib2 was not found at /);
    });

    it('should return library config', () => {
        const conf = [{
            libs: {
                lib1: {
                    conf: 'of lib1',
                    path: path.resolve(__dirname, 'mocks', 'node_modules', 'lib1')
                }
            }
        }];

        const bemConfig = config(conf);

        const libConf = bemConfig().librarySync('lib1').getSync();

        // because of mocked rc, all instances of bemConfig has always the same data
        expect(libConf).to.deep.equal(conf[0]);
    });

    // module()
    it('should return undefined if no modules in config', () => {
        const bemConfig = config();

        expect(bemConfig().moduleSync('m1')).to.equal(undefined);
    });

    it('should return undefined if no module found', () => {
        const bemConfig = config([{
            modules: {
                m1: {
                    conf: 'of m1'
                }
            }
        }]);

        expect(bemConfig().moduleSync('m2')).to.equal(undefined);
    });

    it('should return module', () => {
        const bemConfig = config([{
            modules: {
                m1: {
                    conf: 'of m1'
                },
                m2: {
                    conf: 'of m2'
                }
            }
        }]);

        expect(bemConfig().moduleSync('m1')).to.deep.equal({ conf: 'of m1' });
    });

    it('should not extend with configs higher then root', () => {
        const bemConfig = config([{
            levels: [
                { path: 'level1', l1o1: 'should not be used', l1o2: 'should not be used either' }
            ]
        }, {
            root: true,
            levels: [
                { path: 'level1', something: 'from root level', l1o1: 'should be overwritten' }
            ]
        }, {
            levels: [
                { path: 'level1', l1o1: 'should win' }
            ]
        }]);

        const actual = bemConfig().levelSync('level1');

        expect(actual).to.deep.equal({ something: 'from root level', l1o1: 'should win' });
    });

    it('should respect rc options', () => {
        const pathToConfig = path.resolve(__dirname, 'mocks', 'argv-conf.json');
        const actual = notStubbedBemConfig({
            defaults: { conf: 'def' },
            pathToConfig: pathToConfig,
            fsRoot: process.cwd(),
            fsHome: process.cwd()
        }).getSync();

        expect(actual).to.deep.equal({ conf: 'def', argv: true, __source: pathToConfig });
    });

    it('should respect extendedBy from rc options', () => {
        const pathToConfig = path.resolve(__dirname, 'mocks', 'argv-conf.json');
        const actual = notStubbedBemConfig({
            defaults: {
                levels: [
                    { path: 'path/to/level', test1: 1, same: 'initial' }
                ],
                common: 'initial',
                original: 'blah'
            },
            extendBy: {
                levels: [
                    { path: 'path/to/level', test2: 2, same: 'new' }
                ],
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

        expect(actual).to.deep.equal(expected);
    });

    // levels
    it('should return levels set', () => {
        const bemConfig = config([{
            levels: [
                { layer: 'common', data: '1' },
                { layer: 'desktop', data: '2' },
                { layer: 'touch', path: 'custom-path', data: '3' },
                { layer: 'touch-phone', data: '4' },
                { layer: 'touch-pad', data: '5' }
            ],
            sets: {
                desktop: 'common desktop',
                'touch-phone': 'common desktop@ touch touch-phone',
                'touch-pad': 'common touch touch-pad'
            },
            __source: path.join(process.cwd(), path.basename(__filename))
        }]);

        const expected = [
            {
                data: '1',
                layer: 'common',
                path: path.resolve('common.blocks')
            },
            {
                data: '2',
                layer: 'desktop',
                path: path.resolve('desktop.blocks')
            },
            {
                data: '3',
                layer: 'touch',
                path: path.resolve('custom-path')
            },
            {
                data: '4',
                layer: 'touch-phone',
                path: path.resolve('touch-phone.blocks')
            }
        ];

        const actual = bemConfig().levelsSync('touch-phone');

        expect(actual).to.deep.equal(expected);
    });

    it('should return levels set with custom paths', () => {
        const bemConfig = config([{
            levels: [
                { layer: 'common', path: 'node_modules/lib/common.blocks' },
                { layer: 'common', path: 'common.blocks' },
                { layer: 'desktop', path: 'desktop.blocks' }
            ],
            sets: {
                desktop: 'common desktop'
            },
            __source: path.join(process.cwd(), path.basename(__filename))
        }]);

        const expected = [
            {
                layer: 'common',
                path: path.resolve('node_modules/lib/common.blocks')
            },
            {
                layer: 'common',
                path: path.resolve('common.blocks')
            },
            {
                layer: 'desktop',
                path: path.resolve('desktop.blocks')
            }
        ];

        const actual = bemConfig().levelsSync('desktop');

        expect(actual).to.deep.equal(expected);
    });
});
