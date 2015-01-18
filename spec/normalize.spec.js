var normalize = require('../lib/normalize');

describe('normalize', function () {
    it('must support undefined', function () {
        normalize()
            .must.be.empty();
    });

    it('must support empty array', function () {
        normalize([])
            .must.be.empty();
    });

    it('must support objects', function () {
        normalize({ name: 'block' })
            .must.have.length(1);
    });

    it('must return set', function () {
        var decl = [
            { name: 'A' },
            { name: 'A' }
        ];

        normalize(decl).must.eql([
            { block: 'A' }
        ]);
    });

    it('must save order', function () {
        var decl = [
            { name: 'A' },
            { name: 'B' },
            { name: 'A' }
        ];

        normalize(decl).must.eql([
            { block: 'A' },
            { block: 'B' }
        ]);
    });

    it('must support array', function () {
        var decl = [
            { name: 'A' },
            { name: 'B' }
        ];

        normalize(decl).must.eql([
            { block: 'A' },
            { block: 'B' }
        ]);
    });

    describe('mods', function () {
        it('must support objects', function () {
            var decl = { name: 'block', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support mod shortcut', function () {
            var decl = { name: 'block', mods: [{ name: 'mod' }] };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: true }
            ]);
        });
    });

    describe('elems', function () {
        it('must support arrays', function () {
            var decl = {
                name: 'block',
                elems: [
                    { name: 'elem-1' },
                    { name: 'elem-2' }
                ]
            };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem-1' },
                { block: 'block', elem: 'elem-2' }
            ]);
        });

        it('must support objects', function () {
            var decl = {
                name: 'block',
                elems: [
                    { name: 'elem', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] }
                ]
            };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support mod shortcut', function () {
            var decl = {
                name: 'block',
                elems: [
                    { name: 'elem', mods: [{ name: 'mod' }] }
                ]
            };

            normalize(decl).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
            ]);
        });
    });
});
