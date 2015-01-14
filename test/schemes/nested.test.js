var path = require('path'),
    mock = require('mock-fs'),
    walk = require('../../lib/index'),
    verboseAssert = require('../lib/assert'),
    opts = { scheme: 'nested' },
    assert = function (levels, expected, done) {
        verboseAssert(levels, opts, expected, done);
    };

describe('nested scheme', function () {
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

    describe('ignore', function () {
        it('must ignore entity dir', function (done) {
            mock({
                blocks: {
                    block: {}
                }
            });

            var levels = ['blocks'],
                expected = [];

            assert(levels, expected, done);
        });

        it('must ignore entity without ext', function (done) {
            mock({
                blocks: {
                    block: {
                        block: ''
                    }
                }
            });

            var levels = ['blocks'],
                expected = [];

            assert(levels, expected, done);
        });

        it('must support invalid BEM-notation', function (done) {
            mock({
                blocks: {
                    block: {
                        __elem: {
                            _mod: {
                                '^_^.tech': ''
                            },
                            '^_^.tech': ''
                        },
                        _mod: {
                            '^_^.tech': ''
                        },
                        '^_^.tech': ''
                    }
                }
            });

            var levels = ['blocks'],
                expected = [];

            assert(levels, expected, done);
        });

        it('must ignore file in root of level', function (done) {
            mock({
                blocks: {
                    'block.tech': ''
                }
            });

            var levels = ['blocks'],
                expected = [];

            assert(levels, expected, done);
        });

        it('must not detect block if filename not match with dirname', function (done) {
            mock({
                blocks: {
                    block: {
                        'other-block.tech': ''
                    }
                }
            });

            var levels = ['blocks'],
                expected = [];

            assert(levels, expected, done);
        });

        it('must not detect elem if filename not match with dirname', function (done) {
            mock({
                blocks: {
                    block: {
                        _mod: {
                            'block_other-mod.tech': ''
                        }
                    }
                }
            });

            var levels = ['blocks'],
                expected = [];

            assert(levels, expected, done);
        });

        it('must not detect mod if filename not match with dirname', function (done) {
            mock({
                blocks: {
                    block: {
                        __elem: {
                            'block__other-elem.tech': ''
                        }
                    }
                }
            });

            var levels = ['blocks'],
                expected = [];

            assert(levels, expected, done);
        });

        it('must not detect elem mod if filename not match with dirname', function (done) {
            mock({
                blocks: {
                    block: {
                        __elem: {
                            _mod: {
                                'block__elem_other-mod.tech': ''
                            }
                        }
                    }
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
                    block: {
                        'block.tech': ''
                    }
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block', 'block.tech')
                }];

            assert(levels, expected, done);
        });

        it('must support complex tech', function (done) {
            mock({
                blocks: {
                    block: {
                        'block.tech.name': ''
                    }
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block' },
                    tech: 'tech.name',
                    level: 'blocks',
                    path: path.join('blocks', 'block', 'block.tech.name')
                }];

            assert(levels, expected, done);
        });

        it('must detect bool mod', function (done) {
            mock({
                blocks: {
                    block: {
                        '_bool-mod': {
                            'block_bool-mod.tech': ''
                        }
                    }
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block', modName: 'bool-mod', modVal: true },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block', '_bool-mod', 'block_bool-mod.tech')
                }];

            assert(levels, expected, done);
        });

        it('must detect mod', function (done) {
            mock({
                blocks: {
                    block: {
                        _mod: {
                            'block_mod_val.tech': ''
                        }
                    }
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block', modName: 'mod', modVal: 'val' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block', '_mod', 'block_mod_val.tech')
                }];

            assert(levels, expected, done);
        });

        it('must detect elem', function (done) {
            mock({
                blocks: {
                    block: {
                        __elem: {
                            'block__elem.tech': ''
                        }
                    }
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block', elem: 'elem' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block', '__elem', 'block__elem.tech')
                }];

            assert(levels, expected, done);
        });

        it('must detect bool mod of elem', function (done) {
            mock({
                blocks: {
                    block: {
                        __elem: {
                            '_bool-mod': {
                                'block__elem_bool-mod.tech': ''
                            }
                        }
                    }
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block', elem: 'elem', modName: 'bool-mod', modVal: true },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block', '__elem', '_bool-mod', 'block__elem_bool-mod.tech')
                }];

            assert(levels, expected, done);
        });

        it('must detect elem mod', function (done) {
            mock({
                blocks: {
                    block: {
                        __elem: {
                            _mod: {
                                'block__elem_mod_val.tech': ''
                            }
                        }
                    }
                }
            });

            var levels = ['blocks'],
                expected = [{
                    entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block', '__elem', '_mod', 'block__elem_mod_val.tech')
                }];

            assert(levels, expected, done);
        });

        it('must detect complex entities', function (done) {
            mock({
                blocks: {
                    block: {
                        'block.tech': '',
                        '_bool-mod': {
                            'block_bool-mod.tech': ''
                        },
                        _mod: {
                            'block_mod_val.tech': ''
                        },
                        __elem: {
                            'block__elem.tech': '',
                            '_bool-mod': {
                                'block__elem_bool-mod.tech': ''
                            },
                            _mod: {
                                'block__elem_mod_val.tech': ''
                            }
                        }
                    }
                }
            });

            var levels = ['blocks'],
                expected = [
                    {
                        entity: { block: 'block' },
                        tech: 'tech',
                        level: 'blocks',
                        path: path.join('blocks', 'block', 'block.tech')
                    },
                    {
                        entity: { block: 'block', elem: 'elem' },
                        tech: 'tech',
                        level: 'blocks',
                        path: path.join('blocks', 'block', '__elem', 'block__elem.tech')
                    },
                    {
                        entity: { block: 'block', modName: 'bool-mod', modVal: true },
                        tech: 'tech',
                        level: 'blocks',
                        path: path.join('blocks', 'block', '_bool-mod', 'block_bool-mod.tech')
                    },
                    {
                        entity: { block: 'block', modName: 'mod', modVal: 'val' },
                        tech: 'tech',
                        level: 'blocks',
                        path: path.join('blocks', 'block', '_mod', 'block_mod_val.tech')
                    },
                    {
                        entity: { block: 'block', elem: 'elem', modName: 'bool-mod', modVal: true },
                        tech: 'tech',
                        level: 'blocks',
                        path: path.join('blocks', 'block', '__elem', '_bool-mod', 'block__elem_bool-mod.tech')
                    },
                    {
                        entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
                        tech: 'tech',
                        level: 'blocks',
                        path: path.join('blocks', 'block', '__elem', '_mod', 'block__elem_mod_val.tech')
                    }
                ];

            assert(levels, expected, done);
        });

        it('must support few levels', function (done) {
            mock({
                'common.blocks': {
                    block: {
                        'block.tech': ''
                    }
                },
                'desktop.blocks': {
                    block: {
                        'block.tech': ''
                    }
                }
            });

            var levels = ['common.blocks', 'desktop.blocks'],
                expected = [
                    {
                        entity: { block: 'block' },
                        level: 'common.blocks',
                        path: path.join('common.blocks', 'block', 'block.tech'),
                        tech: 'tech'
                    },
                    {
                        entity: { block: 'block' },
                        level: 'desktop.blocks',
                        path: path.join('desktop.blocks', 'block', 'block.tech'),
                        tech: 'tech'
                    }
                ];

            assert(levels, expected, done);
        });
    });
});
