'use strict';

const path = require('path');

const test = require('ava');
const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../../lib/index');

test.afterEach('restore fs', () => {
    mockFs.restore();
});

test('should support level name with extension', t => {
    mockFs({
        'name.blocks': {
            'block.tech': ''
        }
    });

    const options = {
        levels: {
            'name.blocks': { scheme: 'flat' }
        }
    };

    return toArray(walk(['name.blocks'], options))
        .then(files => {
            const file = files[0];

            t.deepEqual(file.cell.entity.valueOf(), { block: 'block' });
            t.is(file.cell.layer, 'name.blocks');
            t.is(file.path, path.join('name.blocks', 'block.tech'));
            t.is(file.cell.tech, 'tech');
        });
});

test('should support few levels', t => {
    mockFs({
        'level-1': {
            'block-1.tech': ''
        },
        'level-2': {
            'block-2.tech': ''
        }
    });

    const options = {
        levels: {
            'level-1': { scheme: 'flat' },
            'level-2': { scheme: 'flat' }
        }
    };

    return toArray(walk(['level-1', 'level-2'], options))
        .then(files => {
            const file1 = files[0];
            const file2 = files[1];

            t.deepEqual(file1.cell.entity.valueOf(), { block: 'block-1' });
            t.is(file1.cell.layer, 'level-1');
            t.is(file1.cell.tech, 'tech');
            t.is(file1.path, path.join('level-1', 'block-1.tech'));

            t.deepEqual(file2.cell.entity.valueOf(), { block: 'block-2' });
            t.is(file2.cell.layer, 'level-2');
            t.is(file2.cell.tech, 'tech');
            t.is(file2.path, path.join('level-2', 'block-2.tech'));
        });
});

test('should detect entity with the same name on every level', t => {
    mockFs({
        'level-1': {
            'block.tech': ''
        },
        'level-2': {
            'block.tech': ''
        }
    });

    const options = {
        levels: {
            'level-1': { scheme: 'flat' },
            'level-2': { scheme: 'flat' }
        }
    };

    return toArray(walk(['level-1', 'level-2'], options))
        .then(files => {
            const file1 = files[0];
            const file2 = files[1];

            t.deepEqual(file1.cell.entity.valueOf(), { block: 'block' });
            t.is(file1.cell.layer, 'level-1');
            t.is(file1.cell.tech, 'tech');
            t.is(file1.path, path.join('level-1', 'block.tech'));

            t.deepEqual(file2.cell.entity.valueOf(), { block: 'block' });
            t.is(file2.cell.layer, 'level-2');
            t.is(file2.cell.tech, 'tech');
            t.is(file2.path, path.join('level-2', 'block.tech'));
        });
});
