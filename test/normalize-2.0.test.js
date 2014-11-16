var nomralize = require('../lib/normalize-v2');

describe('nomralize 2.0', function () {

    it('should support objects', function () {
        nomralize({ block: 'block' }).should.eql([
            { block: 'block' }
        ]);
    });

describe('mods', function () {
    it('should support objects', function () {
        nomralize({ block: 'block', modName: 'mod' }).should.eql([
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: true }
        ]);
    });

    it('should support objects', function () {
        nomralize({ block: 'block', modName: 'mod', modVal: true }).should.eql([
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: true }
        ]);
    });

    it('should support objects', function () {
        nomralize({ block: 'block', mod: 'mod' }).should.eql([
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: true }
        ]);
    });

    it('should support objects', function () {
        nomralize({ block: 'block', mod: 'mod', modVal: 'val' }).should.eql([
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: true }
        ]);
    });

    it('should support objects', function () {
        nomralize({ block: 'block', modName: 'mod', modVal: 'val' }).should.eql([
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: 'val' }
        ]);
    });

    it('should support objects', function () {
        nomralize({ block: 'block', mods: { mod: 'val' }}).should.eql([
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: 'val' }
        ]);
    });

    it('should support arrays as object values', function () {
        nomralize({ block: 'block', mods: ['mod-1', 'mod-2'] }).should.eql([
            { block: 'block' },
            { block: 'block', modName: 'mod-1', modVal: true },
            { block: 'block', modName: 'mod-2', modVal: true }
        ]);
    });

    it('should support arrays as object values', function () {
        nomralize({ block: 'block', mods: { mod: ['val-1', 'val-2'] }}).should.eql([
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: 'val-1' },
            { block: 'block', modName: 'mod', modVal: 'val-2' }
        ]);
    });
});

describe('elems', function () {
    it('should support arrays', function () {
        nomralize({ block: 'block', elem: 'elem' }).should.eql([
            { block: 'block' },
            { block: 'block',  elem: 'elem' }
        ]);
    });

    it('should support arrays', function () {
        nomralize({ block: 'block', elems: ['elem-1', 'elem-2'] }).should.eql([
            { block: 'block' },
            { block: 'block', elem: 'elem-1' },
            { block: 'block',  elem: 'elem-2' }
        ]);
    });

    it('should support objects', function () {
        nomralize({ block: 'block', elem: 'elem', mod: 'mod' }).should.eql([
            { block: 'block' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
        ]);
    });

    it('should support objects', function () {
        nomralize({ block: 'block', elem: 'elem', mod: 'mod', modVal: 'val' }).should.eql([
            { block: 'block' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
        ]);
    });

    it('should support objects', function () {
        nomralize({ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }).should.eql([
            { block: 'block' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
        ]);
    });

    it('should support objects', function () {
        nomralize({ block: 'block', elem: 'elem', mods: { mod: 'val' }}).should.eql([
            { block: 'block' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
        ]);
    });

    it('should support objects', function () {
        nomralize({ block: 'block', elem: 'elem', mods: { mod: 'val' }}).should.eql([
            { block: 'block' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
        ]);
    });

    it('should support arrays as object values', function () {
        nomralize({ block: 'block', elem: 'elem', mods: ['mod-1', 'mod-2'] }).should.eql([
            { block: 'block' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod-1', modVal: true },
            { block: 'block', elem: 'elem', modName: 'mod-2', modVal: true }
        ]);
    });

    it('should support arrays as object values', function () {
        nomralize({ block: 'block', elem: 'elem', mods: { mod: ['val-1', 'val-2'] }}).should.eql([
            { block: 'block' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-1' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-2' }
        ]);
    });
});

    it('should support arrays as object values', function () {
        nomralize({ block: 'block', elems: ['elem-1', 'elem-2'], mods: ['mod-1', 'mod-2'] }).should.eql([
            { block: 'block' },
            { block: 'block', elem: 'elem-1' },
            { block: 'block', elem: 'elem-2' },
            { block: 'block', modName: 'mod-1', modVal: true },
            { block: 'block', modName: 'mod-2', modVal: true }
        ]);
    });

    it('should support arrays as object values', function () {
        nomralize({ block: 'block', elems: ['elem-1', 'elem-2'], mod: 'mod' }).should.eql([
            { block: 'block' },
            { block: 'block', elem: 'elem-1' },
            { block: 'block', elem: 'elem-2' },
            { block: 'block', modName: 'mod', modVal: true }
        ]);
    });

});
