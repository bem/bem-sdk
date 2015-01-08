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
        normalize({ block: 'block' }).must.eql([
            { block: 'block' }
        ]);
    });

    it('must support array', function () {
        normalize([{ block: 'A' }, { block: 'B' }]).must.eql([
            { block: 'A' }, { block: 'B' }
        ]);
    });

    describe('mods', function () {
        it('must support shortcat for boolean mod by BEM-notation', function () {
            normalize({ block: 'block', modName: 'mod' }).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: true }
            ]);
        });

        it('must support boolean mod by BEM-notation', function () {
            normalize({ block: 'block', modName: 'mod', modVal: true }).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: true }
            ]);
        });

        it('must support mod by BEM-notation', function () {
            normalize({ block: 'block', modName: 'mod', modVal: 'val' }).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support mods as objects', function () {
            normalize({ block: 'block', mods: { mod: 'val' } }).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support boolean mods as array', function () {
            normalize({ block: 'block', mods: ['mod-1', 'mod-2'] }).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod-1', modVal: true },
                { block: 'block', modName: 'mod-2', modVal: true }
            ]);
        });

        it('must support mod values as array', function () {
            normalize({ block: 'block', mods: { mod: ['val-1', 'val-2'] } }).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val-1' },
                { block: 'block', modName: 'mod', modVal: 'val-2' }
            ]);
        });
    });

    describe('elems', function () {
        it('must support elem by BEM-notation', function () {
            normalize({ block: 'block', elem: 'elem' }).must.eql([
                { block: 'block' },
                { block: 'block',  elem: 'elem' }
            ]);
        });

        it('must support boolean mod of elem by BEM-notation', function () {
            normalize({ block: 'block', elem: 'elem', modName: 'mod', modVal: true }).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
            ]);
        });

        it('must support elem mod by BEM-notation', function () {
            normalize({ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support elems as arrays', function () {
            normalize({ block: 'block', elems: ['elem-1', 'elem-2'] }).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem-1' },
                { block: 'block',  elem: 'elem-2' }
            ]);
        });

        it('must support elem mods as object', function () {
            normalize({ block: 'block', elem: 'elem', mods: { mod: 'val' } }).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support boolean mods of elem as array', function () {
            normalize({ block: 'block', elem: 'elem', mods: ['mod-1', 'mod-2'] }).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod-1', modVal: true },
                { block: 'block', elem: 'elem', modName: 'mod-2', modVal: true }
            ]);
        });

        it('must support mod values of elem as array', function () {
            normalize({ block: 'block', elem: 'elem', mods: { mod: ['val-1', 'val-2'] } }).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-1' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-2' }
            ]);
        });
    });

    describe('mix', function () {
        it('must support elems with block mods', function () {
            normalize({ block: 'block', elems: ['elem-1', 'elem-2'], mods: ['mod-1', 'mod-2'] }).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem-1' },
                { block: 'block', elem: 'elem-2' },
                { block: 'block', modName: 'mod-1', modVal: true },
                { block: 'block', modName: 'mod-2', modVal: true }
            ]);
        });

        it('must support elems with block mod', function () {
            normalize({ block: 'block', elems: ['elem-1', 'elem-2'], modName: 'mod' }).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem-1' },
                { block: 'block', elem: 'elem-2' },
                { block: 'block', modName: 'mod', modVal: true }
            ]);
        });
    });
});
