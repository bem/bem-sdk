'use strict';

const test = require('ava');
const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../../lib/index');

const options = {
    levels: {
        blocks: { scheme: 'flat' }
    }
};

test.afterEach('restore fs', () => {
    mockFs.restore();
});

test('should detect each techs of the same entity', t => {
    mockFs({
        blocks: {
            'block.tech-1': '',
            'block.tech-2': ''
        }
    });

    return toArray(walk(['blocks'], options))
        .then(files => {
            const techs = files.map(file => file.cell.tech);

            t.deepEqual(techs, ['tech-1', 'tech-2']);
        });
});

test('should support complex tech', t => {
    mockFs({
        blocks: {
            'block.tech-1.tech-2': ''
        }
    });

    return toArray(walk(['blocks'], options))
        .then(files => {
            const techs = files.map(file => file.cell.tech);

            t.deepEqual(techs, ['tech-1.tech-2']);
        });
});
