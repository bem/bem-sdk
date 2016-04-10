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

test('should detect each techs of the same entity', t => {
    mockFs({
        blocks: {
            block: {
                'block.tech-1': '',
                'block.tech-2': ''
            }
        }
    });

    return toArray(walk(['blocks'], bemconfig))
        .finally(() => mockFs.restore())
        .then(files => {
            const techs = files.map(file => file.tech);

            t.deepEqual(techs, ['tech-1', 'tech-2']);
        });
});

test('should support complex tech', t => {
    mockFs({
        blocks: {
            block: {
                'block.tech-1.tech-2': ''
            }
        }
    });

    return toArray(walk(['blocks'], bemconfig))
        .finally(() => mockFs.restore())
        .then(files => {
            const techs = files.map(file => file.tech);

            t.deepEqual(techs, ['tech-1.tech-2']);
        });
});
