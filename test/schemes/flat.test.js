'use strict';

const path = require('path');
const schemeAssert = require('../lib/scheme-assert');
const defaults = { scheme: 'flat' };
const assert = function (fs, expected) {
    return schemeAssert(fs, defaults, expected);
};

describe('flat scheme', () => {
    describe('errors', () => {
        it('must throw error if level is not found', () => {
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
                blocks: {}
            };
            const expected = [];

            return assert(fs, expected);
        });

        it('must ignore files without extension', () => {
            const fs = {
                blocks: {
                    block: ''
                }
            };
            const expected = [];

            return assert(fs, expected);
        });

        it('must ignore files with no BEM basename', () => {
            const fs = {
                blocks: {
                    '^_^.ext': ''
                }
            };
            const expected = [];

            return assert(fs, expected);
        });
    });

    describe('detect', () => {
        it('must detect block', () => {
            const fs = {
                blocks: {
                    'block.tech': ''
                }
            };
            const expected = [{
                entity: { block: 'block' },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block.tech')
            }];

            return assert(fs, expected);
        });

        it('must detect bool mod of block', () => {
            const fs = {
                blocks: {
                    'block_mod.tech': ''
                }
            };
            const expected = [{
                entity: { block: 'block', modName: 'mod', modVal: true },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block_mod.tech')
            }];

            return assert(fs, expected);
        });

        it('must detect key-val mod of block', () => {
            const fs = {
                blocks: {
                    'block_mod_val.tech': ''
                }
            };
            const expected = [{
                entity: { block: 'block', modName: 'mod', modVal: 'val' },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block_mod_val.tech')
            }];

            return assert(fs, expected);
        });

        it('must detect elem', () => {
            const fs = {
                blocks: {
                    'block__elem.tech': ''
                }
            };
            const expected = [{
                entity: { block: 'block', elem: 'elem' },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block__elem.tech')
            }];

            return assert(fs, expected);
        });

        it('must detect bool mod of elem', () => {
            const fs = {
                blocks: {
                    'block__elem_mod.tech': ''
                }
            };
            const expected = [{
                entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block__elem_mod.tech')
            }];

            return assert(fs, expected);
        });

        it('must detect key-val mod of elem', () => {
            const fs = {
                blocks: {
                    'block__elem_mod_val.tech': ''
                }
            };
            const expected = [{
                entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block__elem_mod_val.tech')
            }];

            return assert(fs, expected);
        });
    });

    describe('techs', () => {
        it('must detect each techs of the same entity', () => {
            const fs = {
                blocks: {
                    'block.tech-1': '',
                    'block.tech-2': ''
                }
            };
            const expected = [
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

        it('must support complex tech', () => {
            const fs = {
                blocks: {
                    'block.tech-1.tech-2': ''
                }
            };
            const expected = [{
                entity: { block: 'block' },
                tech: 'tech-1.tech-2',
                level: 'blocks',
                path: path.join('blocks', 'block.tech-1.tech-2')
            }];

            return assert(fs, expected);
        });
    });

    describe('levels', () => {
        it('must support level name with extension', () => {
            const fs = {
                'name.blocks': {
                    'block.tech': ''
                }
            };
            const expected = [{
                entity: { block: 'block' },
                level: 'name.blocks',
                path: path.join('name.blocks', 'block.tech'),
                tech: 'tech'
            }];

            return assert(fs, expected);
        });

        it('must support few levels', () => {
            const fs = {
                'level-1': {
                    'block-1.tech': ''
                },
                'level-2': {
                    'block-2.tech': ''
                }
            };
            const expected = [
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

        it('must detect entity with the same name on every level', () => {
            const fs = {
                'level-1': {
                    'block.tech': ''
                },
                'level-2': {
                    'block.tech': ''
                }
            };
            const expected = [
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
