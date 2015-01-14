var path = require('path'),
    mock = require('mock-fs'),
    verboseAssert = require('../lib/assert'),
    opts = {},
    assert = function (levels, expected, done) {
        verboseAssert(levels, opts, expected, done);
    };

describe('multi scheme', function () {
    afterEach(function () {
        mock.restore();
    });

    it('must support several schemes', function (done) {
        mock({
            'flat.level': {
                'block.tech': ''
            },
            'nested.level': {
                block: {
                    'block.tech': ''
                }
            }
        });

        var levels = [
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

        assert(levels, expected, done);
    });
});
