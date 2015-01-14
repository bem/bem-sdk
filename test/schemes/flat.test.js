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
        });
    });

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
                '^_^.ext': ''
            }
        });

        var levels = ['blocks'],
            expected = [];

        assert(levels, expected, done);
    });

    it('must detect block', function (done) {
        mock({
            blocks: {
                'block.ext': ''
            }
        });

        var levels = ['blocks'],
            expected = [{
                block: 'block',
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block.ext')
            }];

        assert(levels, expected, done);
    });

    it('must detect bool mod', function (done) {
        mock({
            blocks: {
                'block_bool-mod.ext': ''
            }
        });

        var levels = ['blocks'],
            expected = [{
                block: 'block',
                modName: 'bool-mod',
                modVal: true,
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block_bool-mod.ext')
            }];

        assert(levels, expected, done);
    });

    it('must detect mod', function (done) {
        mock({
            blocks: {
                'block_mod_val.ext': ''
            }
        });

        var levels = ['blocks'],
            expected = [{
                block: 'block',
                modName: 'mod',
                modVal: 'val',
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block_mod_val.ext')
            }];

        assert(levels, expected, done);
    });

    it('must detect elem', function (done) {
        mock({
            blocks: {
                'block__elem.ext': ''
            }
        });

        var levels = ['blocks'],
            expected = [{
                block: 'block',
                elem: 'elem',
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block__elem.ext')
            }];

        assert(levels, expected, done);
    });

    it('must detect bool mod of elem', function (done) {
        mock({
            blocks: {
                'block__elem_bool-mod.ext': ''
            }
        });

        var levels = ['blocks'],
            expected = [{
                block: 'block',
                elem: 'elem',
                modName: 'bool-mod',
                modVal: true,
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block__elem_bool-mod.ext')
            }];

        assert(levels, expected, done);
    });

    it('must detect elem mod', function (done) {
        mock({
            blocks: {
                'block__elem_mod_val.ext': ''
            }
        });

        var levels = ['blocks'],
            expected = [{
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: 'val',
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block__elem_mod_val.ext')
            }];

        assert(levels, expected, done);
    });

    it('must detect block in few levels', function (done) {
        mock({
            'common.blocks': {
                'block.ext': ''
            },
            'desktop.blocks': {
                'block.ext': ''
            }
        });

        var levels = ['common.blocks', 'desktop.blocks'],
            expected = [
                {
                    block: 'block',
                    level: 'common.blocks',
                    path: path.join('common.blocks', 'block.ext'),
                    tech: 'ext'
                },
                {
                    block: 'block',
                    level: 'desktop.blocks',
                    path: path.join('desktop.blocks', 'block.ext'),
                    tech: 'ext'
                }
            ];

        assert(levels, expected, done);
    });
});
