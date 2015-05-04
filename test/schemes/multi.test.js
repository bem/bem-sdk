var path = require('path'),
    mock = require('mock-fs'),
    verboseAssert = require('../lib/assert'),
    opts = {},
    assert = function (fs, levels, expected, done) {
        mock(fs);

        verboseAssert(levels, opts, expected, done);
    };

describe('multi scheme', function () {
    afterEach(function () {
        mock.restore();
    });

    it('must support several schemes', function (done) {
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

        assert(fs, levels, expected, done);
    });
});
