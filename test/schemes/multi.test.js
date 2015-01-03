var path = require('path'),
    mock = require('mock-fs'),
    assert = require('../lib/assert');

describe('multi scheme', function () {
    afterEach(function () {
        mock.restore();
    });

    it('must support several schemes', function (done) {
        var levels = [
            {
                path: 'flat.level',
                scheme: 'flat'
            },
            {
                path: 'nested.level',
                scheme: 'nested'
            }
        ];

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

        assert(levels, {}, [
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
        ], done);
    });
});
