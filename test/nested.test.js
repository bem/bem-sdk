var mock = require('mock-fs'),
    object = require('bem-object'),
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

    it('must detect block', function (done) {
        mock({
            blocks: {
                block: {
                    'block.ext': ''
                }
            }
        });

        assert([ 'blocks' ], [ object('blocks/block.ext') ], done);
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

        assert([ 'blocks' ], [ object('blocks/block_bool-mod.ext') ], done);
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

        assert([ 'blocks' ], [ object('blocks/block_mod_val.ext') ], done);
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

        assert([ 'blocks' ], [ object('blocks/block__elem.ext') ], done);
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

        assert([ 'blocks' ], [ object('blocks/block__elem_bool-mod.ext') ], done);
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

        assert([ 'blocks' ], [ object('blocks/block__elem_mod_val.ext') ], done);
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
            object('common.blocks/block.ext'),
            object('desktop.blocks/block.ext')
        ], done);
    });
});
