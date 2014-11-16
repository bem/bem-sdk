var mock = require('mock-fs'),
    walk = require('../lib');

function assert(levels, expected, cb) {
    var buffer = [],
        walker = walk(levels);

    walker.on('data', function (obj) {
        buffer.push(obj);
    });
    walker.on('end', function () {
        try {
            buffer.must.eql(expected);
            cb();
        } catch (e) {
            cb(e);
        }
    });
}

describe('nested scheme', function () {
    afterEach(function () {
        mock.restore();
    });

    it('must end if levels is empty', function (done) {
        assert([], [], done);
    });

    it('must ignore entity without ext', function (done) {
        mock({
            blocks: {
                block: {
                    block: ''
                }
            }
        });

        assert([ 'blocks' ], [], done);
    });

    it('must detect block', function (done) {
        mock({
            blocks: {
                block: {
                    'block.ext': ''
                }
            }
        });

        assert([ 'blocks' ], [{
            bem: 'block',
            id: 'block',
            block: 'block',
            tech: 'ext',
            level: 'blocks',
            path: 'blocks/block/block.ext'
        }], done);
    });

    it('must detect bool mod', function (done) {
        mock({
            blocks: {
                block: {
                    '_bool-mod': {
                        'block_bool-mod.ext': ''
                    }
                }
            }
        });

        assert([ 'blocks' ], [{
            bem: 'block_bool-mod',
            id: 'block_bool-mod',
            block: 'block',
            modName: 'bool-mod',
            modVal: true,
            tech: 'ext',
            level: 'blocks',
            path: 'blocks/block/_bool-mod/block_bool-mod.ext'
        }], done);
    });

    it('must detect mod', function (done) {
        mock({
            blocks: {
                block: {
                    _mod: {
                        'block_mod_val.ext': ''
                    }
                }
            }
        });

        assert([ 'blocks' ], [{
            bem: 'block_mod_val',
            id: 'block_mod_val',
            block: 'block',
            modName: 'mod',
            modVal: 'val',
            tech: 'ext',
            level: 'blocks',
            path: 'blocks/block/_mod/block_mod_val.ext'
        }], done);
    });

    it('must detect elem', function (done) {
        mock({
            blocks: {
                block: {
                    __elem: {
                        'block__elem.ext': ''
                    }
                }
            }
        });

        assert([ 'blocks' ], [{
            bem: 'block__elem',
            id: 'block__elem',
            block: 'block',
            elem: 'elem',
            tech: 'ext',
            level: 'blocks',
            path: 'blocks/block/__elem/block__elem.ext'
        }], done);
    });

    it('must detect bool mod of elem', function (done) {
        mock({
            blocks: {
                block: {
                    __elem: {
                        '_bool-mod': {
                            'block__elem_bool-mod.ext': ''
                        }
                    }
                }
            }
        });

        assert([ 'blocks' ], [{
            bem: 'block__elem_bool-mod',
            id: 'block__elem_bool-mod',
            block: 'block',
            elem: 'elem',
            modName: 'bool-mod',
            modVal: true,
            tech: 'ext',
            level: 'blocks',
            path: 'blocks/block/__elem/_bool-mod/block__elem_bool-mod.ext'
        }], done);
    });

    it('must detect elem mod', function (done) {
        mock({
            blocks: {
                block: {
                    __elem: {
                        _mod: {
                            'block__elem_mod_val.ext': ''
                        }
                    }
                }
            }
        });

        assert([ 'blocks' ], [{
            bem: 'block__elem_mod_val',
            id: 'block__elem_mod_val',
            block: 'block',
            elem: 'elem',
            modName: 'mod',
            modVal: 'val',
            tech: 'ext',
            level: 'blocks',
            path: 'blocks/block/__elem/_mod/block__elem_mod_val.ext'
        }], done);
    });

    it('must detect block in few levels', function (done) {
        mock({
            'common.blocks': {
                block: {
                    'block.ext': ''
                }
            },
            'desktop.blocks': {
                block: {
                    'block.ext': ''
                }
            }
        });

        assert([ 'common.blocks', 'desktop.blocks' ], [
            {
                bem: 'block',
                block: 'block',
                id: 'block',
                level: 'common.blocks',
                path: 'common.blocks/block/block.ext',
                tech: 'ext'
            },
            {
                bem: 'block',
                block: 'block',
                id: 'block',
                level: 'desktop.blocks',
                path: 'desktop.blocks/block/block.ext',
                tech: 'ext'
            }
        ], done);
    });
});
