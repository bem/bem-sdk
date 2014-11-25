var path = require('path'),
    mock = require('mock-fs'),
    walk = require('../../lib/index');

function assert(levels, naming, expected, cb) {
    var buffer = [],
        walker = walk(levels, { scheme: 'flat', naming: naming });

    walker.on('data', function (obj) {
        buffer.push(obj);
    });

    walker.on('end', function () {
        try {
            buffer.must.eql(expected);
            cb();
        } catch (e) {
            cb(e);
        }
    });
}

describe('naming', function () {
    afterEach(function () {
        mock.restore();
    });

    it('must support original naming', function (done) {
        mock({
            blocks: {
                'block__elem_bool-mod.ext': ''
            }
        });

        assert(['blocks'], { elem: '__', mod: '_' }, [{
            block: 'block',
            elem: 'elem',
            modName: 'bool-mod',
            modVal: true,
            tech: 'ext',
            level: 'blocks',
            path: path.join('blocks', 'block__elem_bool-mod.ext')
        }], done);
    });

    it('must support Convention by Harry Roberts', function (done) {
        mock({
            blocks: {
                'block__elem--bool-mod.ext': ''
            }
        });

        assert(['blocks'], { elem: '__', mod: '--' }, [{
            block: 'block',
            elem: 'elem',
            modName: 'bool-mod',
            modVal: true,
            tech: 'ext',
            level: 'blocks',
            path: path.join('blocks', 'block__elem--bool-mod.ext')
        }], done);
    });

    it('must support custom naming', function (done) {
        mock({
            blocks: {
                'block-elem--boolMod.ext': ''
            }
        });

        assert(['blocks'], {
            elem: '-',
            mod: '--',
            wordPattern: '[a-zA-Z0-9]+'
        }, [{
            block: 'block',
            elem: 'elem',
            modName: 'boolMod',
            modVal: true,
            tech: 'ext',
            level: 'blocks',
            path: path.join('blocks', 'block-elem--boolMod.ext')
        }], done);
    });
});
