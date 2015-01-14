var path = require('path'),
    mock = require('mock-fs'),
    walk = require('../../lib/index'),
    assert = require('../lib/assert'),
    opts = { scheme: 'nested' };

describe('nested scheme', function () {
    afterEach(function () {
        mock.restore();
    });

    it('must end if levels is empty', function (done) {
        assert([], opts, [], done);
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
            blocks: {
                block: {}
            }
        });

        assert(['blocks'], opts, [], done);
    });

    it('must ignore entity without ext', function (done) {
        mock({
            blocks: {
                block: {
                    block: ''
                }
            }
        });

        assert(['blocks'], opts, [], done);
    });

    it('must detect block', function (done) {
        mock({
            blocks: {
                block: {
                    'block.ext': ''
                }
            }
        });

        assert(['blocks'], opts, [{
            block: 'block',
            tech: 'ext',
            level: 'blocks',
            path: path.join('blocks', 'block', 'block.ext')
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

        assert(['blocks'], opts, [{
            block: 'block',
            modName: 'bool-mod',
            modVal: true,
            tech: 'ext',
            level: 'blocks',
            path: path.join('blocks', 'block', '_bool-mod', 'block_bool-mod.ext')
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

        assert(['blocks'], opts, [{
            block: 'block',
            modName: 'mod',
            modVal: 'val',
            tech: 'ext',
            level: 'blocks',
            path: path.join('blocks', 'block', '_mod', 'block_mod_val.ext')
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

        assert(['blocks'], opts, [{
            block: 'block',
            elem: 'elem',
            tech: 'ext',
            level: 'blocks',
            path: path.join('blocks', 'block', '__elem', 'block__elem.ext')
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

        assert(['blocks'], opts, [{
            block: 'block',
            elem: 'elem',
            modName: 'bool-mod',
            modVal: true,
            tech: 'ext',
            level: 'blocks',
            path: path.join('blocks', 'block', '__elem', '_bool-mod', 'block__elem_bool-mod.ext')
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

        assert(['blocks'], opts, [{
            block: 'block',
            elem: 'elem',
            modName: 'mod',
            modVal: 'val',
            tech: 'ext',
            level: 'blocks',
            path: path.join('blocks', 'block', '__elem', '_mod', 'block__elem_mod_val.ext')
        }], done);
    });

    it('must detect complex entities', function (done) {
        mock({
            blocks: {
                block: {
                    'block.ext': '',
                    '_bool-mod': {
                        'block_bool-mod.ext': ''
                    },
                    _mod: {
                        'block_mod_val.ext': ''
                    },
                    __elem: {
                        'block__elem.ext': '',
                        '_bool-mod': {
                            'block__elem_bool-mod.ext': ''
                        },
                        _mod: {
                            'block__elem_mod_val.ext': ''
                        }
                    }
                }
            }
        });

        assert(['blocks'], opts, [
            {
                block: 'block',
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block', 'block.ext')
            },
            {
                block: 'block',
                elem: 'elem',
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block', '__elem', 'block__elem.ext')
            },
            {
                block: 'block',
                modName: 'bool-mod',
                modVal: true,
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block', '_bool-mod', 'block_bool-mod.ext')
            },
            {
                block: 'block',
                modName: 'mod',
                modVal: 'val',
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block', '_mod', 'block_mod_val.ext')
            },
            {
                block: 'block',
                elem: 'elem',
                modName: 'bool-mod',
                modVal: true,
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block', '__elem', '_bool-mod', 'block__elem_bool-mod.ext')
            },
            {
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: 'val',
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block', '__elem', '_mod', 'block__elem_mod_val.ext')
            }
        ], done);
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

        assert(['common.blocks', 'desktop.blocks'], opts, [
            {
                block: 'block',
                level: 'common.blocks',
                path: path.join('common.blocks', 'block', 'block.ext'),
                tech: 'ext'
            },
            {
                block: 'block',
                level: 'desktop.blocks',
                path: path.join('desktop.blocks', 'block', 'block.ext'),
                tech: 'ext'
            }
        ], done);
    });

    it('must not detect file in root of level', function (done) {
        mock({
            blocks: {
                'block.ext': ''
            }
        });

        assert(['blocks'], opts, [], done);
    });

    it('must not detect block if filename not match with dirname', function (done) {
        mock({
            blocks: {
                block: {
                    'other-block.ext': ''
                }
            }
        });

        assert(['blocks'], opts, [], done);
    });

    it('must not detect elem if filename not match with dirname', function (done) {
        mock({
            blocks: {
                block: {
                    _mod: {
                        'block_other-mod.ext': ''
                    }
                }
            }
        });

        assert(['blocks'], opts, [], done);
    });

    it('must not detect mod if filename not match with dirname', function (done) {
        mock({
            blocks: {
                block: {
                    __elem: {
                        'block__other-elem.ext': ''
                    }
                }
            }
        });

        assert(['blocks'], opts, [], done);
    });

    it('must not detect elem mod if filename not match with dirname', function (done) {
        mock({
            blocks: {
                block: {
                    __elem: {
                        _mod: {
                            'block__elem_other-mod.ext': ''
                        }
                    }
                }
            }
        });

        assert(['blocks'], opts, [], done);
    });

    it('must handle invalid BEM-notation', function (done) {
        mock({
            blocks: {
                block: {
                    __elem: {
                        _mod: {
                            '^_^.ext': ''
                        },
                        '^_^.ext': ''
                    },
                    _mod: {
                        '^_^.ext': ''
                    },
                    '^_^.ext': ''
                }
            }
        });

        assert(['blocks'], opts, [], done);
    });
});
