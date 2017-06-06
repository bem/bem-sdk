'use strict';

const test = require('ava');
const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../../lib/index');

const options = {
    levels: {
        blocks: { scheme: 'nested' }
    }
};

test.afterEach('restore fs', () => {
    mockFs.restore();
});

test('should detect block', t => {
    mockFs({
        blocks: {
            block: {
                'block.tech': ''
            }
        }
    });

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [{ block: 'block' }]);
        });
});

test('should detect bool mod of block', t => {
    mockFs({
        blocks: {
            block: {
                _mod: {
                    'block_mod.tech': ''
                }
            }
        }
    });

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [{
                block: 'block',
                mod: { name: 'mod', val: true }
            }]);
        });
});

test('should detect key-val mod of block', t => {
    mockFs({
        blocks: {
            block: {
                _mod: {
                    'block_mod_val.tech': ''
                }
            }
        }
    });

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [{
                block: 'block',
                mod: { name: 'mod', val: 'val' }
            }]);
        });
});

test('should detect elem', t => {
    mockFs({
        blocks: {
            block: {
                __elem: {
                    'block__elem.tech': ''
                }
            }
        }
    });

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [{ block: 'block', elem: 'elem' }]);
        });
});

test('should detect bool mod of elem', t => {
    mockFs({
        blocks: {
            block: {
                __elem: {
                    '_mod': {
                        'block__elem_mod.tech': ''
                    }
                }
            }
        }
    });

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [{
                block: 'block',
                elem: 'elem',
                mod: { name: 'mod', val: true }
            }]);
        });
});

test('should detect key-val mod of elem', t => {
    mockFs({
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

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [{
                block: 'block',
                elem: 'elem',
                mod: { name: 'mod', val: 'val' }
            }]);
        });
});

test('should detect complex entities', t => {
    mockFs({
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

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', mod: { name: 'bool-mod', val: true } },
                { block: 'block', mod: { name: 'mod', val: 'val' } },
                { block: 'block', elem: 'elem', mod: { name: 'bool-mod', val: true } },
                { block: 'block', elem: 'elem', mod: { name: 'mod', val: 'val' } }
            ]);
        });
});
