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
                'block__elem_bool-mod.tech': ''
            }
        });

        var levels = ['blocks'],
            expected = [{
                entity: { block: 'block', elem: 'elem', modName: 'bool-mod', modVal: true },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block__elem_bool-mod.tech')
            }];

        assert(levels, convention.original, expected, done);
    });

    it('must support Convention by Harry Roberts', function (done) {
        mock({
            blocks: {
                'block__elem--bool-mod.tech': ''
            }
        });

        var levels = ['blocks'],
            expected = [{
                entity: { block: 'block', elem: 'elem', modName: 'bool-mod', modVal: true },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block__elem--bool-mod.tech')
            }];

        assert(levels, convention.csswizardry, expected, done);
    });

    it('must support custom naming', function (done) {
        mock({
            blocks: {
                'block-elem--boolMod.tech': ''
            }
        });

        var levels = ['blocks'],
            expected = [{
                entity: { block: 'block', elem: 'elem', modName: 'boolMod', modVal: true },
                tech: 'tech',
                level: 'blocks',
                path: path.join('blocks', 'block-elem--boolMod.tech')
            }];

        assert(levels, convention.custom, expected, done);
    });

    it('must support several naming', function (done) {
        mock({
            'original.naming': {
                'block__elem_bool-mod.tech': ''
            },
            'csswizardry.naming': {
                'block__elem--bool-mod.tech': ''
            }
        });

        var levels = [
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
            ],
            expected = [
                {
                    entity: { block: 'block', elem: 'elem', modName: 'bool-mod', modVal: true },
                    tech: 'tech',
                    level: 'original.naming',
                    path: path.join('original.naming', 'block__elem_bool-mod.tech')
                },
                {
                    entity: { block: 'block', elem: 'elem', modName: 'bool-mod', modVal: true },
                    tech: 'tech',
                    level: 'csswizardry.naming',
                    path: path.join('csswizardry.naming', 'block__elem--bool-mod.tech')
                }
            ];

        assert(levels, {}, expected, done);
    });
});
