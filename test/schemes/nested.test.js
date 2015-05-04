var path = require('path'),
    mockAndAssert = require('../lib/mock-and-assert'),
    opts = { scheme: 'nested' },
    assert = function (fs, expected) {
        var levels = Object.keys(fs);

        return mockAndAssert(fs, levels, opts, expected);
    };

describe('nested scheme', function () {
    describe('errors', function () {
        it('must throw error if levels is not found', function () {
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
                    blocks: {
                        block: {}
                    }
                },
                expected = [];

            return assert(fs, expected);
        });

        it('must ignore files without extension', function () {
            var fs = {
                    blocks: {
                        block: {
                            block: ''
                        }
                    }
                },
                expected = [];

            return assert(fs, expected);
        });

        it('must ignore files with no BEM basename', function () {
            var fs = {
                    blocks: {
                        block: {
                            '^_^.tech': ''
                        }
                    }
                },
                expected = [];

            return assert(fs, expected);
        });

        it('must ignore file in root of level', function () {
            var fs = {
                    blocks: {
                        'block.tech': ''
                    }
                },
                expected = [];

            return assert(fs, expected);
        });

        describe('filename matches', function () {
            it('must ignore block if filename not match with dirname', function () {
                var fs = {
                        blocks: {
                            block: {
                                'other-block.tech': ''
                            }
                        }
                    },
                    expected = [];

                return assert(fs, expected);
            });

            it('must ignore block mod if filename not match with dirname', function () {
                var fs = {
                        blocks: {
                            block: {
                                _mod: {
                                    'block_other-mod.tech': ''
                                }
                            }
                        }
                    },
                    expected = [];

                return assert(fs, expected);
            });

            it('must ignore elem if filename not match with dirname', function () {
                var fs = {
                        blocks: {
                            block: {
                                _mod: {
                                    'block_other-mod.tech': ''
                                }
                            }
                        }
                    },
                    expected = [];

                return assert(fs, expected);
            });

            it('must ignore elem mod if filename not match with dirname', function () {
                var fs = {
                        blocks: {
                            block: {
                                __elem: {
                                    _mod: {
                                        'block__elem_other-mod.tech': ''
                                    }
                                }
                            }
                        }
                    },
                    expected = [];

                return assert(fs, expected);
            });
        });
    });

    describe('detect', function () {
        it('must detect block', function () {
            var fs = {
                    blocks: {
                        block: {
                            'block.tech': ''
                        }
                    }
                },
                expected = [{
                    entity: { block: 'block' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block', 'block.tech')
                }];

            return assert(fs, expected);
        });

        it('must detect bool mod of block', function () {
            var fs = {
                    blocks: {
                        block: {
                            _mod: {
                                'block_mod.tech': ''
                            }
                        }
                    }
                },
                expected = [{
                    entity: { block: 'block', modName: 'mod', modVal: true },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block', '_mod', 'block_mod.tech')
                }];

            return assert(fs, expected);
        });

        it('must detect key-val mod of block', function () {
            var fs = {
                    blocks: {
                        block: {
                            _mod: {
                                'block_mod_val.tech': ''
                            }
                        }
                    }
                },
                expected = [{
                    entity: { block: 'block', modName: 'mod', modVal: 'val' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block', '_mod', 'block_mod_val.tech')
                }];

            return assert(fs, expected);
        });

        it('must detect elem', function () {
            var fs = {
                    blocks: {
                        block: {
                            __elem: {
                                'block__elem.tech': ''
                            }
                        }
                    }
                },
                expected = [{
                    entity: { block: 'block', elem: 'elem' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block', '__elem', 'block__elem.tech')
                }];

            return assert(fs, expected);
        });

        it('must detect bool mod of elem', function () {
            var fs = {
                    blocks: {
                        block: {
                            __elem: {
                                '_bool-mod': {
                                    'block__elem_bool-mod.tech': ''
                                }
                            }
                        }
                    }
                },
                expected = [{
                    entity: { block: 'block', elem: 'elem', modName: 'bool-mod', modVal: true },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block', '__elem', '_bool-mod', 'block__elem_bool-mod.tech')
                }];

            return assert(fs, expected);
        });

        it('must detect key-val mod of elem', function () {
            var fs = {
                    blocks: {
                        block: {
                            __elem: {
                                _mod: {
                                    'block__elem_mod_val.tech': ''
                                }
                            }
                        }
                    }
                },
                expected = [{
                    entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
                    tech: 'tech',
                    level: 'blocks',
                    path: path.join('blocks', 'block', '__elem', '_mod', 'block__elem_mod_val.tech')
                }];

            return assert(fs, expected);
        });

        it('must detect complex entities', function () {
            var fs = {
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
                },
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

            return assert(fs, expected);
        });
    });

    describe('techs', function () {
        it('must detect each techs of the same entity', function () {
            var fs = {
                    blocks: {
                        block: {
                            'block.tech1': '',
                            'block.tech2': ''
                        }
                    }
                },
                expected = [
                    {
                        entity: { block: 'block' },
                        tech: 'tech1',
                        level: 'blocks',
                        path: path.join('blocks', 'block', 'block.tech1')
                    },
                    {
                        entity: { block: 'block' },
                        tech: 'tech2',
                        level: 'blocks',
                        path: path.join('blocks', 'block', 'block.tech2')
                    }
                ];

            return assert(fs, expected);
        });

        it('must support complex tech', function () {
            var fs = {
                    blocks: {
                        block: {
                            'block.tech-1.tech-2': ''
                        }
                    }
                },
                expected = [{
                    entity: { block: 'block' },
                    tech: 'tech-1.tech-2',
                    level: 'blocks',
                    path: path.join('blocks', 'block', 'block.tech-1.tech-2')
                }];

            return assert(fs, expected);
        });
    });

    describe('levels', function () {
        it('must support level name with extension', function () {
            var fs = {
                    'name.blocks': {
                        block: {
                            'block.tech': ''
                        }
                    }
                },
                expected = [{
                    entity: { block: 'block' },
                    level: 'name.blocks',
                    path: path.join('name.blocks', 'block', 'block.tech'),
                    tech: 'tech'
                }];

            return assert(fs, expected);
        });

        it('must support few levels', function () {
            var fs = {
                    'level-1': {
                        'block-1': {
                            'block-1.tech': ''
                        }
                    },
                    'level-2': {
                        'block-2': {
                            'block-2.tech': ''
                        }
                    }
                },
                expected = [
                    {
                        entity: { block: 'block-1' },
                        level: 'level-1',
                        path: path.join('level-1', 'block-1', 'block-1.tech'),
                        tech: 'tech'
                    },
                    {
                        entity: { block: 'block-2' },
                        level: 'level-2',
                        path: path.join('level-2', 'block-2', 'block-2.tech'),
                        tech: 'tech'
                    }
                ];

            return assert(fs, expected);
        });

        it('must detect entity with the same name on every level', function () {
            var fs = {
                    'level-1': {
                        block: {
                            'block.tech': ''
                        }
                    },
                    'level-2': {
                        block: {
                            'block.tech': ''
                        }
                    }
                },
                expected = [
                    {
                        entity: { block: 'block' },
                        level: 'level-1',
                        path: path.join('level-1', 'block', 'block.tech'),
                        tech: 'tech'
                    },
                    {
                        entity: { block: 'block' },
                        level: 'level-2',
                        path: path.join('level-2', 'block', 'block.tech'),
                        tech: 'tech'
                    }
                ];

            return assert(fs, expected);
        });
    });
});
