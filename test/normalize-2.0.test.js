var nomralize = require('../lib/normalize-v2');

describe('nomralize 2.0', function () {
    it('must support undefined', function () {
        nomralize().should.eql([]);
    });

    it('must support empty array', function () {
        nomralize([]).should.eql([]);
    });

    it('must support block', function () {
        nomralize({ block: 'block' }).should.eql([
            { block: 'block' }
        ]);
    });

    it('must support array', function () {
        nomralize([{ block: 'A' }, { block: 'B' }]).should.eql([
            { block: 'A' }, { block: 'B' }
        ]);
    });

    describe('mods', function () {
        it('must support shortcat for boolean mod by BEM-notation', function () {
            nomralize({ block: 'block', modName: 'mod' }).should.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: true }
            ]);
        });

        it('must support boolean mod by BEM-notation', function () {
            nomralize({ block: 'block', modName: 'mod', modVal: true }).should.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: true }
            ]);
        });

        it('must support mod by BEM-notation', function () {
            nomralize({ block: 'block', modName: 'mod', modVal: 'val' }).should.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support mods as objects', function () {
            nomralize({ block: 'block', mods: { mod: 'val' } }).should.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support boolean mods as array', function () {
            nomralize({ block: 'block', mods: ['mod-1', 'mod-2'] }).should.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod-1', modVal: true },
                { block: 'block', modName: 'mod-2', modVal: true }
            ]);
        });

        it('must support mod values as array', function () {
            nomralize({ block: 'block', mods: { mod: ['val-1', 'val-2'] } }).should.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val-1' },
                { block: 'block', modName: 'mod', modVal: 'val-2' }
            ]);
        });
    });

    describe('elems', function () {
        it('must support elem by BEM-notation', function () {
            nomralize({ block: 'block', elem: 'elem' }).should.eql([
                { block: 'block' },
                { block: 'block',  elem: 'elem' }
            ]);
        });

        it('must support boolean mod of elem by BEM-notation', function () {
            nomralize({ block: 'block', elem: 'elem', modName: 'mod', modVal: true }).should.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
            ]);
        });

        it('must support elem mod by BEM-notation', function () {
            nomralize({ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }).should.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support elems as arrays', function () {
            nomralize({ block: 'block', elems: ['elem-1', 'elem-2'] }).should.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem-1' },
                { block: 'block',  elem: 'elem-2' }
            ]);
        });

        it('must support elem mods as object', function () {
            nomralize({ block: 'block', elem: 'elem', mods: { mod: 'val' } }).should.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support boolean mods of elem as array', function () {
            nomralize({ block: 'block', elem: 'elem', mods: ['mod-1', 'mod-2'] }).should.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod-1', modVal: true },
                { block: 'block', elem: 'elem', modName: 'mod-2', modVal: true }
            ]);
        });

        it('must support mod values of elem as array', function () {
            nomralize({ block: 'block', elem: 'elem', mods: { mod: ['val-1', 'val-2'] } }).should.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-1' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-2' }
            ]);
        });
    });

    describe('mix', function () {
        it('must support elems with block mods', function () {
            nomralize({ block: 'block', elems: ['elem-1', 'elem-2'], mods: ['mod-1', 'mod-2'] }).should.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem-1' },
                { block: 'block', elem: 'elem-2' },
                { block: 'block', modName: 'mod-1', modVal: true },
                { block: 'block', modName: 'mod-2', modVal: true }
            ]);
        });

        it('must support elems with block mod', function () {
            nomralize({ block: 'block', elems: ['elem-1', 'elem-2'], modName: 'mod' }).should.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem-1' },
                { block: 'block', elem: 'elem-2' },
                { block: 'block', modName: 'mod', modVal: true }
            ]);
        });
    });
});
