var bemdecl = require('..'),
    nomralize = function (decl) {
        return bemdecl.normalize(decl, '1.0');
    };

describe('nomralize 1.0', function () {
    it('must support undefined', function () {
        nomralize().should.eql([]);
    });

    it('must support empty array', function () {
        nomralize([]).should.eql([]);
    });

    it('must support objects', function () {
        nomralize({ name: 'block' }).should.eql([
            { block: 'block' }
        ]);
    });

    it('must support array', function () {
        nomralize([{ name: 'A' }, { name: 'B' }]).should.eql([
            { block: 'A' }, { block: 'B' }
        ]);
    });

    describe('mods', function () {
        it('must support objects', function () {
            nomralize({ name: 'block', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] }).should.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });
    });

    describe('elems', function () {
        it('must support arrays', function () {
            nomralize({
                name: 'block',
                elems: [{ name: 'elem-1' }, { name: 'elem-2' }]
            }).should.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem-1' },
                { block: 'block', elem: 'elem-2' }
            ]);
        });

        it('must support objects', function () {
            nomralize({
                name: 'block',
                elems: [{ name: 'elem', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] }]
            }).should.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });
    });
});
