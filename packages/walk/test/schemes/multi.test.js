'use strict';

const path = require('path');

const test = require('ava');
const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../lib/index');

test.afterEach('restore fs', () => {
    mockFs.restore();
});

test('should support several schemes', t => {
    mockFs({
        'flat.blocks': {
            'block.tech': ''
        },
        'nested.blocks': {
            'block': {
                'block.tech': ''
            }
        }
    });

    const options = {
        levels: {
            'flat.blocks': { scheme: 'flat' },
            'nested.blocks': { scheme: 'nested' }
        }
    };

    return toArray(walk(['flat.blocks', 'nested.blocks'], options))
        .then(files => {
            const file1 = files[0];
            const file2 = files[1];

            t.deepEqual(file1.cell.entity.valueOf(), { block: 'block' });
            t.is(file1.cell.layer, 'flat.blocks');
            t.is(file1.cell.tech, 'tech');
            t.is(file1.path, path.join('flat.blocks', 'block.tech'));

            t.deepEqual(file2.cell.entity.valueOf(), { block: 'block' });
            t.is(file2.cell.layer, 'nested.blocks');
            t.is(file2.cell.tech, 'tech');
            t.is(file2.path, path.join('nested.blocks', 'block', 'block.tech'));
        });
});
