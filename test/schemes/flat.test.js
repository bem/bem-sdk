var path = require('path'),
    mock = require('mock-fs'),
    walk = require('../../lib/index'),
    verboseAssert = require('../lib/assert'),
    opts = { scheme: 'flat' },
    assert = function (levels, expected, done) {
        verboseAssert(levels, opts, expected, done);
    };

describe('flat scheme', function () {
    afterEach(function () {
        mock.restore();
    });

    it('must end if levels is empty', function (done) {
        var levels = [],
            expected = [];

        assert(levels, expected, done);
    });

    it('must throw error if levels is not found', function (done) {
        var walker = walk(['not-existing-level']);

        walker.on('error', function (err) {
            err.must.throw();
            done();
        })
        .resume();
    });

    describe('ignore', function () {
        it('must ignore entity dir', function (done) {
            mock({
                blocks: {}
            });

            var levels = ['blocks'],
                expected = [];

            assert(levels, expected, done);
        });

        it('must ignore entity without ext', function (done) {
            mock({
                blocks: {
                    block: ''
                }
            });

            var levels = ['blocks'],
                expected = [];

            assert(levels, expected, done);
        });

        it('must support invalid BEM-notation', function (done) {
            mock({
                blocks: {
                    '^_^.tech': ''
                }
            });

            var levels = ['blocks'],
                expected = [];

            assert(levels, expected, done);
        });
    });

    describe('detect', function () {
        it('must detect block', function (done) {
            mock({
                blocks: {
                    'block.tech': ''
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block.tech')
                }];

            assert(levels, expected, done);
        });

        it('must support complex tech', function (done) {
            mock({
                blocks: {
                    'block.tech.name': ''
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block' },
                    tech: 'tech.name',
                    level: 'blocks',
                    path: path.join('blocks', 'block.tech.name')
                }];

            assert(levels, expected, done);
        });

        it('must detect bool mod', function (done) {
            mock({
                blocks: {
                    'block_bool-mod.tech': ''
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block', modName: 'bool-mod', modVal: true },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block_bool-mod.tech')
                }];

            assert(levels, expected, done);
        });

        it('must detect mod', function (done) {
            mock({
                blocks: {
                    'block_mod_val.tech': ''
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block', modName: 'mod', modVal: 'val' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block_mod_val.tech')
                }];

            assert(levels, expected, done);
        });

        it('must detect elem', function (done) {
            mock({
                blocks: {
                    'block__elem.tech': ''
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block', elem: 'elem' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block__elem.tech')
                }];

            assert(levels, expected, done);
        });

        it('must detect bool mod of elem', function (done) {
            mock({
                blocks: {
                    'block__elem_bool-mod.tech': ''
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block', elem: 'elem', modName: 'bool-mod', modVal: true },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block__elem_bool-mod.tech')
                }];

            assert(levels, expected, done);
        });

        it('must detect elem mod', function (done) {
            mock({
                blocks: {
                    'block__elem_mod_val.tech': ''
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block__elem_mod_val.tech')
                }];

            assert(levels, expected, done);
        });

        it('must support few levels', function (done) {
            mock({
                'common.blocks': {
                    'block.tech': ''
                },
                'desktop.blocks': {
                    'block.tech': ''
                }
            });

            var levels = ['common.blocks', 'desktop.blocks'],
                expected = [
                    {
                        entity: { block: 'block' },
                        level: 'common.blocks',
                        path: path.join('common.blocks', 'block.tech'),
                        tech: 'tech'
                    },
                    {
                        entity: { block: 'block' },
                        level: 'desktop.blocks',
                        path: path.join('desktop.blocks', 'block.tech'),
                        tech: 'tech'
                    }
                ];

            assert(levels, expected, done);
        });
    });
});
