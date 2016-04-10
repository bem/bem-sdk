'use strict';

const path = require('path');

const test = require('ava');
const mockFs = require('mock-fs');
const toArray = require('stream-to-array');

const walk = require('../../lib/index');

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
        .finally(() => mockFs.restore())
        .then(files => {
            t.deepEqual(files, [
                {
                    entity: { block: 'block' },
                    tech: 'tech',
                    level: 'flat.blocks',
                    path: path.join('flat.blocks', 'block.tech')
                },
                {
                    entity: { block: 'block' },
                    tech: 'tech',
                    level: 'nested.blocks',
                    path: path.join('nested.blocks', 'block', 'block.tech')
                }
            ]);
        });
});
