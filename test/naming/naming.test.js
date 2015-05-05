var path = require('path'),
    assert = require('../lib/naming-assert');

describe('naming', function () {
    it('must support original naming', function () {
        var fs = {
                'original.blocks': {
                    'block__elem_bool-mod.tech': ''
                }
            },
            expected = [{
                entity: { block: 'block', elem: 'elem', modName: 'bool-mod', modVal: true },
                tech: 'tech',
                level: 'original.blocks',
                path: path.join('original.blocks', 'block__elem_bool-mod.tech')
            }];

        return assert(fs, expected);
    });

    it('must support Convention by Harry Roberts', function () {
        var fs = {
                'csswizardry.blocks': {
                    'block__elem--bool-mod.tech': ''
                }
            },
            expected = [{
                entity: { block: 'block', elem: 'elem', modName: 'bool-mod', modVal: true },
                tech: 'tech',
                level: 'csswizardry.blocks',
                path: path.join('csswizardry.blocks', 'block__elem--bool-mod.tech')
            }];

        return assert(fs, expected);
    });

    it('must support custom naming', function () {
        var fs = {
                'custom.blocks': {
                    'block-elem--boolMod.tech': ''
                }
            },
            expected = [{
                entity: { block: 'block', elem: 'elem', modName: 'boolMod', modVal: true },
                tech: 'tech',
                level: 'custom.blocks',
                path: path.join('custom.blocks', 'block-elem--boolMod.tech')
            }];

        return assert(fs, expected);
    });

    it('must support several naming', function () {
        var fs = {
                'original.naming': {
                    'block__elem_bool-mod.tech': ''
                },
                'csswizardry.naming': {
                    'block__elem--bool-mod.tech': ''
                }
            },
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

        return assert(fs, expected);
    });
});
