'use strict';

const path = require('path');
const assert = require('../lib/scheme-assert');

describe('multi scheme', () => {
    it('must support several schemes', () => {
        const fs = {
            'flat.level': {
                'block.tech': ''
            },
            'nested.level': {
                block: {
                    'block.tech': ''
                }
            }
        };
        const expected = [
            {
                entity: { block: 'block' },
                tech: 'tech',
                level: 'flat.level',
                path: path.join('flat.level', 'block.tech')
            },
            {
                entity: { block: 'block' },
                tech: 'tech',
                level: 'nested.level',
                path: path.join('nested.level', 'block', 'block.tech')
            }
        ];

        return assert(fs, expected);
    });
});
