var path = require('path'),
    mock = require('mock-fs'),
    assert = require('../lib/assert'),
    convention = {
        original: {
            scheme: 'flat',
            naming: { elem: '__', mod: '_' }
        },
        csswizardry: {
            scheme: 'flat',
            naming: { elem: '__', mod: '--' }
        },
        custom:  {
            scheme: 'flat',
            naming: {
                elem: '-',
                mod: '--',
                wordPattern: '[a-zA-Z0-9]+'
            }
        }
    };

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

        var levels = ['blocks'],
            expected = [{
                block: 'block',
                elem: 'elem',
                modName: 'bool-mod',
                modVal: true,
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block__elem_bool-mod.ext')
            }];

        assert(levels, convention.original, expected, done);
    });

    it('must support Convention by Harry Roberts', function (done) {
        mock({
            blocks: {
                'block__elem--bool-mod.ext': ''
            }
        });

        var levels = ['blocks'],
            expected = [{
                block: 'block',
                elem: 'elem',
                modName: 'bool-mod',
                modVal: true,
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block__elem--bool-mod.ext')
            }];

        assert(levels, convention.csswizardry, expected, done);
    });

    it('must support custom naming', function (done) {
        mock({
            blocks: {
                'block-elem--boolMod.ext': ''
            }
        });

        var levels = ['blocks'],
            expected = [{
                block: 'block',
                elem: 'elem',
                modName: 'boolMod',
                modVal: true,
                tech: 'ext',
                level: 'blocks',
                path: path.join('blocks', 'block-elem--boolMod.ext')
            }];

        assert(levels, convention.custom, expected, done);
    });

    it('must support several naming', function (done) {
        mock({
            'original.naming': {
                'block__elem_bool-mod.ext': ''
            },
            'csswizardry.naming': {
                'block__elem--bool-mod.ext': ''
            }
        });

        assert([
            {
                path: 'original.naming',
                scheme: 'flat',
                naming: convention.original
            },
            {
                path: 'csswizardry.naming',
                scheme: 'flat',
                naming: convention.csswizardry.naming
            }
        ], {}, [
            {
                block: 'block',
                elem: 'elem',
                modName: 'bool-mod',
                modVal: true,
                tech: 'ext',
                level: 'original.naming',
                path: path.join('original.naming', 'block__elem_bool-mod.ext')
            },
            {
                block: 'block',
                elem: 'elem',
                modName: 'bool-mod',
                modVal: true,
                tech: 'ext',
                level: 'csswizardry.naming',
                path: path.join('csswizardry.naming', 'block__elem--bool-mod.ext')
            }
        ], done);
    });
});
