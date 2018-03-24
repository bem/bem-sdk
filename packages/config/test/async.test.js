'use strict';

const path = require('path');

const describe = require('mocha').describe;
const it = require('mocha').it;

const chai = require('chai');

chai.use(require('chai-as-promised'));

const expect = chai.expect;

const proxyquire = require('proxyquire');
const notStubbedBemConfig = require('..');

function config(conf) {
    return proxyquire('..', {
        'betterc'() {
            return Promise.resolve(conf || [{}]);
        }
    });
}

describe('async', () => {
    it('should return empty config', () => {
        const bemConfig = config();

        return expect(bemConfig().configs()).to.eventually.deep.equal([{}]);
    });

    it('should return empty config if empty map passed', () => {
        const bemConfig = config([{}]);

        return expect(bemConfig().configs()).to.eventually.deep.equal([{}]);
    });

    it('should return configs', () => {
        const bemConfig = config([
            { test: 1 },
            { test: 2 }
        ]);

        return expect(bemConfig().configs()).to.eventually.deep.equal(
            [{ test: 1 }, { test: 2 }]
        );
    });

    // root()
    it('should return project root', () => {
        const bemConfig = config([
            { test: 1, __source: 'some/path' },
            { test: 2, root: true, __source: __filename },
            { other: 'field', __source: 'some/other/path' }
        ]);

        return expect(bemConfig().root()).to.eventually.equal(
            path.dirname(__filename)
        );
    });

    // get()
    it('should return merged config', () => {
        const bemConfig = config([
            { test: 1 },
            { test: 2 },
            { other: 'field' }
        ]);

        return expect(bemConfig().get()).to.eventually.deep.equal(
            { test: 2, other: 'field' }
        );
    });

    // level()
    it('should return undefined if no levels in config', () => {
        const bemConfig = config();

        return expect(bemConfig().level('l1')).to.eventually.equal(
            undefined
        );
    });

    it('should return undefined if no level found', () => {
        const bemConfig = config([{
            levels: [
                { path: 'l1', some: 'conf' }
            ]
        }]);

        return expect(bemConfig().level('l2')).to.eventually.equal(
            undefined
        );
    });

    it('should return level if no __source provided', () => {
        const bemConfig = config([{
            levels: [
                { path: 'path/to/level', test: 1 }
            ],
            something: 'else'
        }]);

        return expect(bemConfig().level('path/to/level')).to.eventually.deep.equal(
            { test: 1, something: 'else' }
        );
    });

    it('should return level with __source', () => {
        const bemConfig = config([{
            levels: [
                { path: 'path/to/level', test: 1 }
            ],
            something: 'else',
            __source: path.join(process.cwd(), path.basename(__filename))
        }]);

        return expect(bemConfig().level('path/to/level')).to.eventually.deep.equal(
            { test: 1, something: 'else' }
        );
    });

    it('should resolve wildcard levels', () => {
        const bemConfig = config([{
            levels: [
                { path: 'l*', test: 1 }
            ],
            something: 'else'
        }]);

        return Promise.all([
            expect(bemConfig({ cwd: path.resolve(__dirname, 'mocks') }).level('level1')).to.eventually.deep.equal(
                { test: 1, something: 'else' }
            ),

            expect(bemConfig({ cwd: path.resolve(__dirname, 'mocks') }).level('level2')).to.eventually.deep.equal(
                { test: 1, something: 'else' }
            )
        ]);
    });

    it('should resolve wildcard levels with absolute path', () => {
        const conf = {
            levels: [],
            something: 'else'
        };

        conf.levels = [{ path: path.join(__dirname, 'mocks', 'l*'), test: 1 }];

        const bemConfig = config([conf]);

        return expect(bemConfig({ cwd: path.resolve(__dirname, 'mocks') }).level('level1')).to.eventually.deep.equal(
            { test: 1, something: 'else' }
        );
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

        return expect(bemConfig().levelMap()).to.eventually.deep.equal(
            expected
        );
    });

    it('should respect absolute path for level', () => {
        const bemConfig = config([{
            levels: [
                { path: '/path/to/level', test: 1 }
            ],
            something: 'else'
        }]);

        return expect(bemConfig().level('/path/to/level')).to.eventually.deep.equal(
            { test: 1, something: 'else' }
        );
    });

    it('should respect "." path', () => {
        const bemConfig = config([{
            levels: [
               { path:  '.', test: 1 }
            ],
            something: 'else'
        }]);

        return expect(bemConfig().level('.')).to.eventually.deep.equal(
            { test: 1, something: 'else' }
        );
    });

    it('should return extended level config merged from different configs', () => {
        const bemConfig = config([{
            levels: [
                { path: 'level1', l1o1: 'l1v1' }
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

        return expect(bemConfig().level('level1')).to.eventually.deep.equal(
            expected
        );
    });

    it('should not extend with configs higher then root', () => {
        const bemConfig = config([
            {
                levels: [
                    { path: 'level1', l1o1: 'should not be used', l1o2: 'should not be used either' }
                ]
            },
            {
                root: true,
                levels: [
                    { path: 'level1', something: 'from root level', l1o1: 'should be overwritten' }
                ]
            },
            {
                levels: [
                    { path: 'level1', l1o1: 'should win' }
                ]
            }
        ]);

        return expect(bemConfig().level('level1')).to.eventually.deep.equal(
            { something: 'from root level', l1o1: 'should win' }
        );
    });

    it('should use last occurrence of array option');

    it('should respect extend for options');

    // levelMap()
    it('should return empty map on levelMap if no levels found', () => {
        const bemConfig = config();

        return expect(bemConfig().levelMap()).to.eventually.deep.equal({});
    });

    it('should return levels map', () => {
        const pathToLib1 = path.resolve(__dirname, 'mocks', 'node_modules', 'lib1');
        const bemConfig = config([{
            levels: [
                { path: 'l1', some: 'conf1' }
            ],
            libs: {
                lib1: {
                    path: pathToLib1,
                    somethingElse: 'lib1 additional data in conf1'
                }
            },
            __source: path.join(process.cwd(), path.basename(__filename))
        }]);

        const expected = {};
        expected[path.resolve('l1')] = { path: path.resolve('l1'), some: 'conf1' };

        // because of mocked rc, all instances of bemConfig has always the same data
        return expect(bemConfig().levelMap()).to.eventually.deep.equal(
            expected
        );
    });

    // library()
    it('should throw if lib format is incorrect', () => {
        const bemConfig = config([{
            libs: {
                lib1: ''
            }
        }]);

        return bemConfig().library('lib1').catch(err => expect(err).to.equal('Invalid `libs` format'));
    });

    it('should throw if lib was not found', () => {
        const bemConfig = config();

        return bemConfig().library('lib1').catch(err => expect(err.includes('Library lib1 was not found at')).to.equal(true));
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

        return Promise.all([
            bemConfig().library('lib1').catch(err => expect(err.includes('Library lib1 was not found at')).to.equal(true)),
            bemConfig().library('lib2').catch(err => expect(err.includes('Library lib2 was not found at')).to.equal(true))
        ]);
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

        return bemConfig().library('lib1')
            .then(lib => {
                return lib.get().then(libConf => {
                    // because of mocked rc, all instances of bemConfig has always the same data
                    return expect(libConf).to.deep.equal(conf[0]);
                });
            });
    });

    // module()
    it('should return undefined if no modules in config', () => {
        const bemConfig = config();

        return expect(bemConfig().module('m1')).to.eventually.equal(
            undefined
        );
    });

    it('should return undefined if no module found', () => {
        const bemConfig = config([{
            modules: {
                m1: {
                    conf: 'of m1'
                }
            }
        }]);

        return expect(bemConfig().module('m2')).to.eventually.equal(
            undefined
        );
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

        return expect(bemConfig().module('m1')).to.eventually.deep.equal(
            { conf: 'of m1' }
        );
    });

    it('should respect rc options', () => {
        const pathToConfig = path.resolve(__dirname, 'mocks', 'argv-conf.json');
        const opts = {
            defaults: { conf: 'def' },
            pathToConfig: pathToConfig,
            fsRoot: process.cwd(),
            fsHome: process.cwd()
        };

        const expected = { conf: 'def', argv: true, __source: pathToConfig };

        return expect(notStubbedBemConfig(opts).get()).to.eventually.deep.equal(
            expected
        );
    });

// TODO: add test for
// resolving, e.g. projectRoot
// 'should override default config with .bemrc'
// 'should not override default levels if none in .bemrc provided'
// 'should not mutate defaults'

    it('should return common config if no levels provided', () => {
        const bemConfig = config([
            { common: 'value' }
        ]);

        return expect(bemConfig().level('level1')).to.eventually.deep.equal(
            { common: 'value' }
        );
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

        return expect(actual).to.eventually.deep.equal(
            expected
        );
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

        const actual = bemConfig().levels('touch-phone');

        return expect(actual).to.eventually.deep.equal(expected);
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

        const actual = bemConfig().levels('desktop');

        return expect(actual).to.eventually.deep.equal(expected);
    });
});
