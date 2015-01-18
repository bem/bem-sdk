var subtract = require('../lib/subtract');

describe('subtract', function () {
    describe('sets', function () {
        it('must subtract set from empty set', function () {
            var A = [{ block: 'A' }];

            subtract([], A)
                .must.be.empty();
        });

        it('must subtract empty set from set', function () {
            var A = [{ block: 'A' }];

            subtract(A, [])
                .must.eql(A);
        });

        it('must support disjoint sets', function () {
            var A = [{ block: 'A' }],
                B = [{ block: 'B' }];

            subtract(A, B)
                .must.eql(A);
        });

        it('must support intersecting sets', function () {
            var ABC = [{ block: 'A' }, { block: 'B' }, { block: 'C' }],
                B   = [{ block: 'B' }],
                AC  = [{ block: 'A' }, { block: 'C' }];

            subtract(ABC, B)
                .must.eql(AC);
        });
    });

    describe('intersecting entities', function () {
        it('must subtract block from block', function () {
            var block = [{ block: 'block' }];

            subtract(block, block)
                .must.be.empty();
        });

        it('must subtract bool mod from bool mod', function () {
            var mod = [{ block: 'block', modName: 'mod', modVal: true }];

            subtract(mod, mod)
                .must.be.empty();
        });

        it('must subtract mod from mod', function () {
            var mod = [{ block: 'block', modName: 'mod', modVal: 'val' }];

            subtract(mod, mod)
                .must.be.empty();
        });

        it('must subtract elem from elem', function () {
            var elem = [{ block: 'block', elem: 'elem' }];

            subtract(elem, elem)
                .must.be.empty();
        });

        it('must subtract bool mod of elem from bool mod of elem', function () {
            var mod = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: true }];

            subtract(mod, mod)
                .must.be.empty();
        });

        it('must subtract elem mod from elem mod', function () {
            var mod = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val' }];

            subtract(mod, mod)
                .must.be.empty();
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

            subtract(decl1, decl2)
                .must.eql(decl1);
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

            subtract(decl1, decl2)
                .must.eql(decl1);
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

            subtract(decl1, decl2)
                .must.eql(decl1);
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

            subtract(decl1, decl2)
                .must.eql(decl1);
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

            subtract(decl1, decl2)
                .must.eql(decl1);
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

            subtract(decl1, decl2)
                .must.eql(decl1);
        });
    });
});
