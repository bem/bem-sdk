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
            block: {
                'block.tech': ''
            }
        }
    });

    const options = {
        levels: {
            'name.blocks': { scheme: 'nested' }
        }
    };

    return toArray(walk(['name.blocks'], options))
        .then(files => {
            t.deepEqual(files, [{
                entity: { block: 'block' },
                level: 'name.blocks',
                path: path.join('name.blocks', 'block', 'block.tech'),
                tech: 'tech'
            }]);
        });
});

test('should support few levels', t => {
    mockFs({
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
    });

    const options = {
        levels: {
            'level-1': { scheme: 'nested' },
            'level-2': { scheme: 'nested' }
        }
    };

    return toArray(walk(['level-1', 'level-2'], options))
        .then(files => {
            t.deepEqual(files, [
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
            ]);
        });
});

test('should detect entity with the same name on every level', t => {
    mockFs({
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
    });

    const options = {
        levels: {
            'level-1': { scheme: 'nested' },
            'level-2': { scheme: 'nested' }
        }
    };

    return toArray(walk(['level-1', 'level-2'], options))
        .then(files => {
            t.deepEqual(files, [
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
            ]);
        });
});
