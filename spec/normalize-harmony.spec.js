var normalize = require('../lib/normalize-harmony');

describe('normalize --harmony', function () {
    it('must support undefined', function () {
        normalize()
            .must.be.empty();
    });

    it('must support empty array', function () {
        normalize([])
            .must.be.empty();
    });

    it('must support block', function () {
        var block = { block: 'block' };

        normalize(block)
            .must.eql([block]);
    });

    it('must return set', function () {
        var A = { block: 'A' };

        normalize([A, A])
            .must.eql([A]);
    });

    it('must save order', function () {
        var A = { block: 'A' },
            B = { block: 'B' };

        normalize([A, B, A])
            .must.eql([A, B]);
    });

    it('must support array', function () {
        var decl = [
            { block: 'A' },
            { block: 'B' }
        ];

        normalize(decl)
            .must.eql(decl);
    });

    describe('mods', function () {
        it('must support shortcut for bool mod', function () {
            var decl = { block: 'block', modName: 'mod' };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: true }
            ]);
        });

        it('must support bool mod', function () {
            var decl = { block: 'block', modName: 'mod', modVal: true };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: true }
            ]);
        });

        it('must support mod', function () {
            var decl = { block: 'block', modName: 'mod', modVal: 'val' };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support mods as objects', function () {
            var decl = {
                block: 'block',
                mods: { mod: 'val' }
            };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support bool mods as array', function () {
            var decl = {
                block: 'block',
                mods: ['mod-1', 'mod-2']
            };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod-1', modVal: true },
                { block: 'block', modName: 'mod-2', modVal: true }
            ]);
        });

        it('must support mod values as array', function () {
            var decl = {
                block: 'block',
                mods: { mod: ['val-1', 'val-2'] }
            };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val-1' },
                { block: 'block', modName: 'mod', modVal: 'val-2' }
            ]);
        });
    });

    describe('elems', function () {
        it('must support elem', function () {
            var decl = { block: 'block', elem: 'elem' };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' }
            ]);
        });

        it('must support shortcut for bool mod of elem', function () {
            var decl = { block: 'block', elem: 'elem', modName: 'mod' };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
            ]);
        });

        it('must support bool mod of elem', function () {
            var decl = { block: 'block', elem: 'elem', modName: 'mod', modVal: true };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
            ]);
        });

        it('must support elem mod', function () {
            var decl = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support elems as arrays', function () {
            var decl = {
                block: 'block',
                elems: ['elem-1', 'elem-2']
            };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem-1' },
                { block: 'block',  elem: 'elem-2' }
            ]);
        });

        it('must support elem mods as object', function () {
            var decl = {
                block: 'block',
                elem: 'elem',
                mods: { mod: 'val' }
            };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support bool mods of elem as array', function () {
            var decl = {
                block: 'block',
                elem: 'elem',
                mods: ['mod-1', 'mod-2']
            };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod-1', modVal: true },
                { block: 'block', elem: 'elem', modName: 'mod-2', modVal: true }
            ]);
        });

        it('must support mod values of elem as array', function () {
            var decl = {
                block: 'block',
                elem: 'elem',
                mods: { mod: ['val-1', 'val-2'] }
            };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-1' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-2' }
            ]);
        });
    });
});
