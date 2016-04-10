'use strict';

const test = require('ava');
const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../../lib/index');

const bemconfig = {
    levels: {
        blocks: { scheme: 'flat' }
    }
};

test.afterEach('restore fs', () => {
    mockFs.restore();
});

test('should end if levels are not specified', t => {
    mockFs({});

    return toArray(walk([], bemconfig))
        .finally(() => mockFs.restore())
        .then(files => {
            t.deepEqual(files, []);
        });
});

test('should ignore empty level', t => {
    mockFs({
        blocks: {}
    });

    return toArray(walk(['blocks'], bemconfig))
        .finally(() => mockFs.restore())
        .then(files => {
            t.deepEqual(files, []);
        });
});

test('should ignore files without extension', t => {
    mockFs({
        blocks: {
            block: ''
        }
    });

    return toArray(walk(['blocks'], bemconfig))
        .finally(() => mockFs.restore())
        .then(files => {
            t.deepEqual(files, []);
        });
});

test('should ignore files with no BEM basename', t => {
    mockFs({
        blocks: {
            '^_^.ext': ''
        }
    });

    return toArray(walk(['blocks'], bemconfig))
        .finally(() => mockFs.restore())
        .then(files => {
            t.deepEqual(files, []);
        });
});
