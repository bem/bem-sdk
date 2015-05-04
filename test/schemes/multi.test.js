var path = require('path'),
    assert = require('../lib/scheme-assert');

describe('multi scheme', function () {
    it('must support several schemes', function () {
        var fs = {
                'flat.level': {
                    'block.tech': ''
                },
                'nested.level': {
                    block: {
                        'block.tech': ''
                    }
                }
            },
            expected = [
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
