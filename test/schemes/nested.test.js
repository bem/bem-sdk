'use strict';

const path = require('path');
const schemeAssert = require('../lib/scheme-assert');
const opts = { scheme: 'nested' };
const assert = function (fs, expected) {
    return schemeAssert(fs, opts, expected);
};

describe('nested scheme', () => {
    describe('errors', () => {
        it('must throw error if levels is not found', () => {
            const fs = {
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

    describe('ignore', () => {
        it('must end if levels are not specified', () => {
            const fs = {};
            const expected = [];

            return assert(fs, expected);
        });

        it('must ignore empty level', () => {
            const fs = {
                blocks: {
                    block: {}
                }
            };
            const expected = [];

            return assert(fs, expected);
        });

        it('must ignore files without extension', () => {
            const fs = {
                blocks: {
                    block: {
                        block: ''
                    }
                }
            };
            const expected = [];

            return assert(fs, expected);
        });

        it('must ignore files with no BEM basename', () => {
            const fs = {
                blocks: {
                    block: {
                        '^_^.tech': ''
                    }
                }
            };
            const expected = [];

            return assert(fs, expected);
        });

        it('must ignore file in root of level', () => {
            const fs = {
                blocks: {
                    'block.tech': ''
                }
            };
            const expected = [];

            return assert(fs, expected);
        });

        describe('filename matches', () => {
            it('must ignore block if filename not match with dirname', () => {
                const fs = {
                    blocks: {
                        block: {
                            'other-block.tech': ''
                        }
                    }
                };
                const expected = [];

                return assert(fs, expected);
            });

            it('must ignore block mod if filename not match with dirname', () => {
                const fs = {
                    blocks: {
                        block: {
                            _mod: {
                                'block_other-mod.tech': ''
                            }
                        }
                    }
                };
                const expected = [];

                return assert(fs, expected);
            });

            it('must ignore elem if filename not match with dirname', () => {
                const fs = {
                    blocks: {
                        block: {
                            _mod: {
                                'block_other-mod.tech': ''
                            }
                        }
                    }
                };
                const expected = [];

                return assert(fs, expected);
            });

            it('must ignore elem mod if filename not match with dirname', () => {
                const fs = {
                    blocks: {
                        block: {
                            __elem: {
                                _mod: {
                                    'block__elem_other-mod.tech': ''
                                }
                            }
                        }
                    }
                };
                const expected = [];

                return assert(fs, expected);
            });
        });
    });

    describe('detect', () => {
        it('must detect block', () => {
            const fs = {
                blocks: {
                    block: {
                        'block.tech': ''
                    }
                }
            };
            const expected = [{
                entity: { block: 'block' },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block', 'block.tech')
            }];

            return assert(fs, expected);
        });

        it('must detect bool mod of block', () => {
            const fs = {
                blocks: {
                    block: {
                        _mod: {
                            'block_mod.tech': ''
                        }
                    }
                }
            };
            const expected = [{
                entity: { block: 'block', modName: 'mod', modVal: true },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block', '_mod', 'block_mod.tech')
            }];

            return assert(fs, expected);
        });

        it('must detect key-val mod of block', () => {
            const fs = {
                blocks: {
                    block: {
                        _mod: {
                            'block_mod_val.tech': ''
                        }
                    }
                }
            };
            const expected = [{
                entity: { block: 'block', modName: 'mod', modVal: 'val' },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block', '_mod', 'block_mod_val.tech')
            }];

            return assert(fs, expected);
        });

        it('must detect elem', () => {
            const fs = {
                blocks: {
                    block: {
                        __elem: {
                            'block__elem.tech': ''
                        }
                    }
                }
            };
            const expected = [{
                entity: { block: 'block', elem: 'elem' },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block', '__elem', 'block__elem.tech')
            }];

            return assert(fs, expected);
        });

        it('must detect bool mod of elem', () => {
            const fs = {
                blocks: {
                    block: {
                        __elem: {
                            '_bool-mod': {
                                'block__elem_bool-mod.tech': ''
                            }
                        }
                    }
                }
            };
            const expected = [{
                entity: { block: 'block', elem: 'elem', modName: 'bool-mod', modVal: true },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block', '__elem', '_bool-mod', 'block__elem_bool-mod.tech')
            }];

            return assert(fs, expected);
        });

        it('must detect key-val mod of elem', () => {
            const fs = {
                blocks: {
                    block: {
                        __elem: {
                            _mod: {
                                'block__elem_mod_val.tech': ''
                            }
                        }
                    }
                }
            };
            const expected = [{
                entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block', '__elem', '_mod', 'block__elem_mod_val.tech')
            }];

            return assert(fs, expected);
        });

        it('must detect complex entities', () => {
            const fs = {
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
            };
            const expected = [
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

    describe('techs', () => {
        it('must detect each techs of the same entity', () => {
            const fs = {
                blocks: {
                    block: {
                        'block.tech1': '',
                        'block.tech2': ''
                    }
                }
            };
            const expected = [
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

        it('must support complex tech', () => {
            const fs = {
                blocks: {
                    block: {
                        'block.tech-1.tech-2': ''
                    }
                }
            };
            const expected = [{
                entity: { block: 'block' },
                tech: 'tech-1.tech-2',
                level: 'blocks',
                path: path.join('blocks', 'block', 'block.tech-1.tech-2')
            }];

            return assert(fs, expected);
        });
    });

    describe('levels', () => {
        it('must support level name with extension', () => {
            const fs = {
                'name.blocks': {
                    block: {
                        'block.tech': ''
                    }
                }
            };
            const expected = [{
                entity: { block: 'block' },
                level: 'name.blocks',
                path: path.join('name.blocks', 'block', 'block.tech'),
                tech: 'tech'
            }];

            return assert(fs, expected);
        });

        it('must support few levels', () => {
            const fs = {
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
            };
            const expected = [
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

        it('must detect entity with the same name on every level', () => {
            const fs = {
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
            };
            const expected = [
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
