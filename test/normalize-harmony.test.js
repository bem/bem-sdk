var bemdecl = require('../lib/index'),
    opts = { harmony: true },
    normalize = function (entities) {
        return bemdecl.normalize(entities, opts);
    };

describe('normalize --harmony', function () {
    it('must support undefined', function () {
        normalize().must.eql([]);
    });

    it('must support empty array', function () {
        normalize([]).must.eql([]);
    });

    it('must support block', function () {
        var entities = { block: 'block' };

        normalize(entities).must.eql([
            { block: 'block' }
        ]);
    });

    it('must support array', function () {
        var entities = [
            { block: 'block-1' },
            { block: 'block-2' }
        ];

        normalize(entities).must.eql([
            { block: 'block-1' },
            { block: 'block-2' }
        ]);
    });

    describe('mods', function () {
        it('must support shortcat for boolean mod by BEM-notation', function () {
            var entities = {
                block: 'block',
                modName: 'mod'
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: true }
            ]);
        });

        it('must support boolean mod by BEM-notation', function () {
            var entities = {
                block: 'block',
                modName: 'mod',
                modVal: true
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: true }
            ]);
        });

        it('must support mod by BEM-notation', function () {
            var entities = {
                block: 'block',
                modName: 'mod',
                modVal: 'val'
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support mods as objects', function () {
            var entities = {
                block: 'block',
                mods: { mod: 'val' }
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support boolean mods as array', function () {
            var entities = {
                block: 'block',
                mods: ['mod-1', 'mod-2']
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod-1', modVal: true },
                { block: 'block', modName: 'mod-2', modVal: true }
            ]);
        });

        it('must support mod values as array', function () {
            var entities = {
                block: 'block',
                mods: { mod: ['val-1', 'val-2'] }
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val-1' },
                { block: 'block', modName: 'mod', modVal: 'val-2' }
            ]);
        });
    });

    describe('elems', function () {
        it('must support elem by BEM-notation', function () {
            var entities = {
                block: 'block',
                elem: 'elem'
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' }
            ]);
        });

        it('must support shortcat for boolean mod of elem by BEM-notation', function () {
            var entities = {
                block: 'block',
                elem: 'elem',
                modName: 'mod'
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
            ]);
        });

        it('must support boolean mod of elem by BEM-notation', function () {
            var entities = {
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: true
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
            ]);
        });

        it('must support elem mod by BEM-notation', function () {
            var entities = {
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: 'val'
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support elems as arrays', function () {
            var entities = {
                block: 'block',
                elems: ['elem-1', 'elem-2']
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem-1' },
                { block: 'block',  elem: 'elem-2' }
            ]);
        });

        it('must support elem mods as object', function () {
            var entities = {
                block: 'block',
                elem: 'elem',
                mods: { mod: 'val' }
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support boolean mods of elem as array', function () {
            var entities = {
                block: 'block',
                elem: 'elem',
                mods: ['mod-1', 'mod-2']
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod-1', modVal: true },
                { block: 'block', elem: 'elem', modName: 'mod-2', modVal: true }
            ]);
        });

        it('must support mod values of elem as array', function () {
            var entities = {
                block: 'block',
                elem: 'elem',
                mods: { mod: ['val-1', 'val-2'] }
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-1' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-2' }
            ]);
        });
    });
});
