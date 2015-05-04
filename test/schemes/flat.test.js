var path = require('path'),
    mock = require('mock-fs'),
    walk = require('../../lib/index'),
    verboseAssert = require('../lib/assert'),
    opts = { scheme: 'flat' },
    assert = function (fs, expected, done) {
        var levels = Object.keys(fs);

        mock(fs);

        verboseAssert(levels, opts, expected, done);
    };

describe('flat scheme', function () {
    afterEach(function () {
        mock.restore();
    });

    describe('errors', function () {
        it('must throw error if level is not found', function (done) {
            var walker = walk(['not-existing-level']);

            walker
                .on('error', function (err) {
                    err.must.throw();
                    done();
                })
                .resume();
        });
    });

    describe('ignore', function () {
        it('must end if levels are not specified', function (done) {
            var fs = {},
                expected = [];

            assert(fs, expected, done);
        });

        it('must ignore empty level', function (done) {
            var fs = {
                    blocks: {}
                },
                expected = [];

            assert(fs, expected, done);
        });

        it('must ignore files without extension', function (done) {
            var fs = {
                    blocks: {
                        block: ''
                    }
                },
                expected = [];

            assert(fs, expected, done);
        });

        it('must ignore files with no BEM basename', function (done) {
            var fs = {
                    blocks: {
                        '^_^.ext': ''
                    }
                },
                expected = [];

            assert(fs, expected, done);
        });
    });

    describe('detect', function () {
        it('must detect block', function (done) {
            var fs = {
                    blocks: {
                        'block.tech': ''
                    }
                },
                expected = [{
                    entity: { block: 'block' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block.tech')
                }];

            assert(fs, expected, done);
        });

        it('must detect bool mod of block', function (done) {
            var fs = {
                    blocks: {
                        'block_mod.tech': ''
                    }
                },
                expected = [{
                    entity: { block: 'block', modName: 'mod', modVal: true },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block_mod.tech')
                }];

            assert(fs, expected, done);
        });

        it('must detect key-val mod of block', function (done) {
            var fs = {
                    blocks: {
                        'block_mod_val.tech': ''
                    }
                },
                expected = [{
                    entity: { block: 'block', modName: 'mod', modVal: 'val' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block_mod_val.tech')
                }];

            assert(fs, expected, done);
        });

        it('must detect elem', function (done) {
            var fs = {
                    blocks: {
                        'block__elem.tech': ''
                    }
                },
                expected = [{
                    entity: { block: 'block', elem: 'elem' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block__elem.tech')
                }];

            assert(fs, expected, done);
        });

        it('must detect bool mod of elem', function (done) {
            var fs = {
                    blocks: {
                        'block__elem_mod.tech': ''
                    }
                },
                expected = [{
                    entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block__elem_mod.tech')
                }];

            assert(fs, expected, done);
        });

        it('must detect key-val mod of elem', function (done) {
            var fs = {
                    blocks: {
                        'block__elem_mod_val.tech': ''
                    }
                },
                expected = [{
                    entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block__elem_mod_val.tech')
                }];

            assert(fs, expected, done);
        });
    });

    describe('techs', function () {
        it('must detect each techs of the same entity', function (done) {
            var fs = {
                    blocks: {
                        'block.tech-1': '',
                        'block.tech-2': ''
                    }
                },
                expected = [
                    {
                        entity: { block: 'block' },
                        tech: 'tech-1',
                        level: 'blocks',
                        path: path.join('blocks', 'block.tech-1')
                    },
                    {
                        entity: { block: 'block' },
                        tech: 'tech-2',
                        level: 'blocks',
                        path: path.join('blocks', 'block.tech-2')
                    }
                ];

            assert(fs, expected, done);
        });

        it('must support complex tech', function (done) {
            var fs = {
                    blocks: {
                        'block.tech-1.tech-2': ''
                    }
                },
                expected = [{
                    entity: { block: 'block' },
                    tech: 'tech-1.tech-2',
                    level: 'blocks',
                    path: path.join('blocks', 'block.tech-1.tech-2')
                }];

            assert(fs, expected, done);
        });
    });

    describe('levels', function () {
        it('must support level name with extension', function (done) {
            var fs = {
                    'name.blocks': {
                        'block.tech': ''
                    }
                },
                expected = [{
                    entity: { block: 'block' },
                    level: 'name.blocks',
                    path: path.join('name.blocks', 'block.tech'),
                    tech: 'tech'
                }];

            assert(fs, expected, done);
        });

        it('must support few levels', function (done) {
            var fs = {
                    'level-1': {
                        'block-1.tech': ''
                    },
                    'level-2': {
                        'block-2.tech': ''
                    }
                },
                expected = [
                    {
                        entity: { block: 'block-1' },
                        level: 'level-1',
                        path: path.join('level-1', 'block-1.tech'),
                        tech: 'tech'
                    },
                    {
                        entity: { block: 'block-2' },
                        level: 'level-2',
                        path: path.join('level-2', 'block-2.tech'),
                        tech: 'tech'
                    }
                ];

            assert(fs, expected, done);
        });

        it('must detect entity with the same name on every level', function (done) {
            var fs = {
                    'level-1': {
                        'block.tech': ''
                    },
                    'level-2': {
                        'block.tech': ''
                    }
                },
                expected = [
                    {
                        entity: { block: 'block' },
                        level: 'level-1',
                        path: path.join('level-1', 'block.tech'),
                        tech: 'tech'
                    },
                    {
                        entity: { block: 'block' },
                        level: 'level-2',
                        path: path.join('level-2', 'block.tech'),
                        tech: 'tech'
                    }
                ];

            assert(fs, expected, done);
        });
    });
});
