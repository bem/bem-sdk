'use strict';

const test = require('ava');
const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../../lib/index');

const bemconfig = {
    levels: {
        blocks: { scheme: 'nested' }
    }
};

test('should detect block', t => {
    mockFs({
        blocks: {
            block: {
                'block.tech': ''
            }
        }
    });

    return toArray(walk(['blocks'], bemconfig))
        .finally(() => mockFs.restore())
        .then(files => {
            const entities = files.map(file => file.entity);

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

    return toArray(walk(['blocks'], bemconfig))
        .finally(() => mockFs.restore())
        .then(files => {
            const entities = files.map(file => file.entity);

            t.deepEqual(entities, [{
                block: 'block',
                modName: 'mod', modVal: true
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

    return toArray(walk(['blocks'], bemconfig))
        .finally(() => mockFs.restore())
        .then(files => {
            const entities = files.map(file => file.entity);

            t.deepEqual(entities, [{
                block: 'block',
                modName: 'mod', modVal: 'val'
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

    return toArray(walk(['blocks'], bemconfig))
        .finally(() => mockFs.restore())
        .then(files => {
            const entities = files.map(file => file.entity);

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

    return toArray(walk(['blocks'], bemconfig))
        .finally(() => mockFs.restore())
        .then(files => {
            const entities = files.map(file => file.entity);

            t.deepEqual(entities, [{
                block: 'block', elem: 'elem',
                modName: 'mod', modVal: true
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

    return toArray(walk(['blocks'], bemconfig))
        .finally(() => mockFs.restore())
        .then(files => {
            const entities = files.map(file => file.entity);

            t.deepEqual(entities, [{
                block: 'block', elem: 'elem',
                modName: 'mod', modVal: 'val'
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

    return toArray(walk(['blocks'], bemconfig))
        .finally(() => mockFs.restore())
        .then(files => {
            const entities = files.map(file => file.entity);

            t.deepEqual(entities, [
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', modName: 'bool-mod', modVal: true },
                { block: 'block', modName: 'mod', modVal: 'val' },
                { block: 'block', elem: 'elem', modName: 'bool-mod', modVal: true },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });
});
