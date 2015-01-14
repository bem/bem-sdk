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
                'block.ext': ''
            },
            'nested.level': {
                block: {
                    'block.ext': ''
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
                    block: 'block',
                    tech: 'ext',
                    level: 'flat.level',
                    path: path.join('flat.level', 'block.ext')
                },
                {
                    block: 'block',
                    tech: 'ext',
                    level: 'nested.level',
                    path: path.join('nested.level', 'block', 'block.ext')
                }
            ];

        assert(levels, expected, done);
    });
});
