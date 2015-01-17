var subtract = require('../lib/index').subtract;

describe('subtract', function () {
    describe('sets', function () {
        it('must subtract set from empty set', function () {
            var decl1 = [],
                decl2 = [{ block: 'block' }];

            subtract(decl1, decl2).must.eql([]);
        });

        it('must subtract empty set from set', function () {
            var decl1 = [{ block: 'block' }],
                decl2 = [];

            subtract(decl1, decl2).must.eql([{ block: 'block' }]);
        });

        it('must support disjoint sets', function () {
            var decl1 = [{ block: 'block-1' }],
                decl2 = [{ block: 'block-2' }];

            subtract(decl1, decl2).must.eql([
                { block: 'block-1' }
            ]);
        });

        it('must support intersecting sets', function () {
            var decl1 = [{ block: 'block-1' }, { block: 'block-2' }, { block: 'block-3' }],
                decl2 = [{ block: 'block-2' }];

            subtract(decl1, decl2).must.eql([
                { block: 'block-1' },
                { block: 'block-3' }
            ]);
        });
    });

    describe('intersecting entities', function () {
        it('must subtract block from block', function () {
            var decl1 = [{ block: 'block' }],
                decl2 = [{ block: 'block' }];

            subtract(decl1, decl2).must.eql([]);
        });

        it('must subtract bool mod from bool mod', function () {
            var decl1 = [{ block: 'block', modName: 'mod', modVal: true }],
                decl2 = [{ block: 'block', modName: 'mod', modVal: true }];

            subtract(decl1, decl2).must.eql([]);
        });

        it('must subtract mod from mod', function () {
            var decl1 = [{ block: 'block', modName: 'mod', modVal: 'val' }],
                decl2 = [{ block: 'block', modName: 'mod', modVal: 'val' }];

            subtract(decl1, decl2).must.eql([]);
        });

        it('must subtract elem from elem', function () {
            var decl1 = [{ block: 'block', elem: 'elem' }],
                decl2 = [{ block: 'block', elem: 'elem' }];

            subtract(decl1, decl2).must.eql([]);
        });

        it('must subtract bool mod of elem from bool mod of elem', function () {
            var decl1 = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: true }],
                decl2 = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: true }];

            subtract(decl1, decl2).must.eql([]);
        });

        it('must subtract elem mod from elem mod', function () {
            var decl1 = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val' }],
                decl2 = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val' }];

            subtract(decl1, decl2).must.eql([]);
        });
    });

    describe('disjoint entities', function () {
        it('must not subtract other entities from block', function () {
            var decl1 = [{ block: 'block' }],
                decl2 = [
                    { block: 'block', modName: 'mod', modVal: true },
                    { block: 'block', modName: 'mod', modVal: 'val' },
                    { block: 'block', elem: 'elem' },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
                ];

            subtract(decl1, decl2).must.eql([
                { block: 'block' }
            ]);
        });

        it('must not subtract other entities from bool mod', function () {
            var decl1 = [{ block: 'block', modName: 'mod', modVal: true }],
                decl2 = [
                    { block: 'block' },
                    { block: 'block', modName: 'mod', modVal: 'val' },
                    { block: 'block', elem: 'elem' },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
                ];

            subtract(decl1, decl2).must.eql([
                { block: 'block', modName: 'mod', modVal: true }
            ]);
        });

        it('must not subtract other entities from mod', function () {
            var decl1 = [{ block: 'block', modName: 'mod', modVal: 'val' }],
                decl2 = [
                    { block: 'block' },
                    { block: 'block', modName: 'mod', modVal: true },
                    { block: 'block', elem: 'elem' },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
                ];

            subtract(decl1, decl2).must.eql([
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must not subtract other entities from elem', function () {
            var decl1 = [{ block: 'block', elem: 'elem' }],
                decl2 = [
                    { block: 'block' },
                    { block: 'block', modName: 'mod', modVal: true },
                    { block: 'block', modName: 'mod', modVal: 'val' },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
                ];

            subtract(decl1, decl2).must.eql([
                { block: 'block', elem: 'elem' }
            ]);
        });

        it('must not subtract other entities from bool mod of elem', function () {
            var decl1 = [{ block: 'block', elem: 'elem',  modName: 'mod', modVal: true }],
                decl2 = [
                    { block: 'block' },
                    { block: 'block', modName: 'mod', modVal: true },
                    { block: 'block', modName: 'mod', modVal: 'val' },
                    { block: 'block', elem: 'elem' },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
                ];

            subtract(decl1, decl2).must.eql([
                { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
            ]);
        });

        it('must not subtract other entities from mod of elem', function () {
            var decl1 = [{ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }],
                decl2 = [
                    { block: 'block' },
                    { block: 'block', modName: 'mod', modVal: true },
                    { block: 'block', modName: 'mod', modVal: 'val' },
                    { block: 'block', elem: 'elem' },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
                ];

            subtract(decl1, decl2).must.eql([
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });
    });
});
