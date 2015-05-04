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

    it('must support original naming', function () {
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

        return assert(levels, convention.original, expected);
    });

    it('must support Convention by Harry Roberts', function () {
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

        return assert(levels, convention.csswizardry, expected);
    });

    it('must support custom naming', function () {
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

        return assert(levels, convention.custom, expected);
    });

    it('must support several naming', function () {
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

        return assert(levels, {}, expected);
    });
});
