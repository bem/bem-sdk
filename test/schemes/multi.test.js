var path = require('path'),
    mockAndAssert = require('../lib/mock-and-assert'),
    opts = {},
    assert = function (fs, levels, expected) {
        return mockAndAssert(fs, levels, opts, expected);
    };

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
            levels = [
                {
                    path: 'flat.level',
                    scheme: 'flat'
                },
                {
                    path: 'nested.level',
                    scheme: 'nested'
                }
            ],
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

        return assert(fs, levels, expected);
    });
});
