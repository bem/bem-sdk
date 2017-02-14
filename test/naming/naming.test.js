'use strict';

const test = require('ava');
const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../lib/index');

test.afterEach('restore fs', () => {
    mockFs.restore();
});

test('should support original naming', t => {
    mockFs({
        blocks: {
            'block__elem_mod_val.tech': ''
        }
    });

    const options = {
        levels: {
            blocks: {
                naming: { elem: '__', mod: '_' },
                scheme: 'flat'
            }
        }
    };

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

test('should support Convention by Harry Roberts', t => {
    mockFs({
        blocks: {
            'block__elem--mod_val.tech': ''
        }
    });

    const options = {
        levels: {
            blocks: {
                naming: { elem: '__', mod: { name: '--', val: '_' } },
                scheme: 'flat'
            }
        }
    };

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

test('should support custom naming', t => {
    mockFs({
        blocks: {
            'block-elem--boolMod.tech': ''
        }
    });

    const options = {
        levels: {
            blocks: {
                naming: {
                    elem: '-',
                    mod: '--',
                    wordPattern: '[a-zA-Z0-9]+'
                },
                scheme: 'flat'
            }
        }
    };

    return toArray(walk(['blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [{
                block: 'block',
                elem: 'elem',
                mod: { name: 'boolMod', val: true }
            }]);
        });
});

test('should support several naming', t => {
    mockFs({
        'original.blocks': {
            'block_mod.tech': ''
        },
        'csswizardry.blocks': {
            'block--mod_val.tech': ''
        }
    });

    const options = {
        levels: {
            'original.blocks': {
                naming: { elem: '__', mod: '_' },
                scheme: 'flat'
            },
            'csswizardry.blocks': {
                naming: { elem: '__', mod: { name: '--', val: '_' } },
                scheme: 'flat'
            }
        }
    };

    return toArray(walk(['original.blocks', 'csswizardry.blocks'], options))
        .then(files => {
            const entities = files.map(file => file.cell.entity.valueOf());

            t.deepEqual(entities, [
                {
                    block: 'block',
                    mod: { name: 'mod', val: true }
                },
                {
                    block: 'block',
                    mod: { name: 'mod', val: 'val' }
                }
            ]);
        });
});
