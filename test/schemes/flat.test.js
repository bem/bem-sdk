var path = require('path'),
    schemeAssert = require('../lib/scheme-assert'),
    defaults = { scheme: 'flat' },
    assert = function (fs, expected) {
        return schemeAssert(fs, defaults, expected);
    };

describe('flat scheme', function () {
    describe('errors', function () {
        it('must throw error if level is not found', function () {
            var fs = {
                    'not-existing-level': false
                };

            return assert(fs)
                .catch(function (err) {
                    err.must.a(Error);
                    err.code.must.be('ENOENT');
                    err.errno.must.be(34);
                });
        });
    });

    describe('ignore', function () {
        it('must end if levels are not specified', function () {
            var fs = {},
                expected = [];

            return assert(fs, expected);
        });

        it('must ignore empty level', function () {
            var fs = {
                    blocks: {}
                },
                expected = [];

            return assert(fs, expected);
        });

        it('must ignore files without extension', function () {
            var fs = {
                    blocks: {
                        block: ''
                    }
                },
                expected = [];

            return assert(fs, expected);
        });

        it('must ignore files with no BEM basename', function () {
            var fs = {
                    blocks: {
                        '^_^.ext': ''
                    }
                },
                expected = [];

            return assert(fs, expected);
        });
    });

    describe('detect', function () {
        it('must detect block', function () {
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

            return assert(fs, expected);
        });

        it('must detect bool mod of block', function () {
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

            return assert(fs, expected);
        });

        it('must detect key-val mod of block', function () {
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

            return assert(fs, expected);
        });

        it('must detect elem', function () {
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

            return assert(fs, expected);
        });

        it('must detect bool mod of elem', function () {
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

            return assert(fs, expected);
        });

        it('must detect key-val mod of elem', function () {
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

            return assert(fs, expected);
        });
    });

    describe('techs', function () {
        it('must detect each techs of the same entity', function () {
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

            return assert(fs, expected);
        });

        it('must support complex tech', function () {
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

            return assert(fs, expected);
        });
    });

    describe('levels', function () {
        it('must support level name with extension', function () {
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

            return assert(fs, expected);
        });

        it('must support few levels', function () {
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

            return assert(fs, expected);
        });

        it('must detect entity with the same name on every level', function () {
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

            return assert(fs, expected);
        });
    });
});
