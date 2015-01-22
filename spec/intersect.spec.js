var intersect = require('../lib/intersect');

describe('intersect', function () {
    describe('sets', function () {
        it('must support only one decl', function () {
            var decl = [{ block: 'block' }];

            intersect(decl)
                .must.be.empty();
        });

        it('must support several decls', function () {
            var block = [{ block: 'block' }];

            intersect(block, block, block, block)
                .must.eql(block);
        });

        it('must intersect set with empty set', function () {
            var decl = [{ block: 'block' }];

            intersect(decl, [])
                .must.be.empty();
        });

        it('must intersect disjoint sets', function () {
            var A = [{ block: 'A' }],
                B = [{ block: 'B' }];

            intersect(A, B)
                .must.be.empty();
        });

        it('must intersect intersecting sets', function () {
            var ABC = [{ block: 'A' }, { block: 'B' }, { block: 'C' }],
                B = [{ block: 'B' }];

            intersect(ABC, B)
                .must.eql(B);
        });
    });

    describe('intersecting entities', function () {
        it('must intersect block with block', function () {
            var block = [{ block: 'block' }];

            intersect(block, block)
                .must.eql(block);
        });

        it('must intersect bool mod with bool mod', function () {
            var mod = [{ block: 'block', modName: 'mod', modVal: true }];

            intersect(mod, mod)
                .must.eql(mod);
        });

        it('must intersect mod with mod', function () {
            var mod = [{ block: 'block', modName: 'mod', modVal: 'val' }];

            intersect(mod, mod)
                .must.eql(mod);
        });

        it('must intersect elem with elem', function () {
            var elem = [{ block: 'block', elem: 'elem' }];

            intersect(elem, elem)
                .must.eql(elem);
        });

        it('must intersect bool mod of elem with bool mod of elem', function () {
            var mod = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: true }];

            intersect(mod, mod)
                .must.eql(mod);
        });

        it('must intersect elem mod with elem mod', function () {
            var mod = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val' }];

            intersect(mod, mod)
                .must.eql(mod);
        });
    });

    describe('disjoint entities', function () {
        it('must not intersect other entities from block', function () {
            var decl1 = [{ block: 'block' }],
                decl2 = [
                    { block: 'block', modName: 'mod', modVal: true },
                    { block: 'block', modName: 'mod', modVal: 'val' },
                    { block: 'block', elem: 'elem' },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
                ];

            intersect(decl1, decl2)
                .must.be.empty();
        });

        it('must not intersect other entities from bool mod', function () {
            var decl1 = [{ block: 'block', modName: 'mod', modVal: true }],
                decl2 = [
                    { block: 'block' },
                    { block: 'block', modName: 'mod', modVal: 'val' },
                    { block: 'block', elem: 'elem' },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
                ];

            intersect(decl1, decl2)
                .must.be.empty();
        });

        it('must not intersect other entities from mod', function () {
            var decl1 = [{ block: 'block', modName: 'mod', modVal: 'val' }],
                decl2 = [
                    { block: 'block' },
                    { block: 'block', modName: 'mod', modVal: true },
                    { block: 'block', elem: 'elem' },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
                ];

            intersect(decl1, decl2)
                .must.be.empty();
        });

        it('must not intersect other entities from elem', function () {
            var decl1 = [{ block: 'block', elem: 'elem' }],
                decl2 = [
                    { block: 'block' },
                    { block: 'block', modName: 'mod', modVal: true },
                    { block: 'block', modName: 'mod', modVal: 'val' },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
                ];

            intersect(decl1, decl2)
                .must.be.empty();
        });

        it('must not intersect other entities from bool mod of elem', function () {
            var decl1 = [{ block: 'block', elem: 'elem',  modName: 'mod', modVal: true }],
                decl2 = [
                    { block: 'block' },
                    { block: 'block', modName: 'mod', modVal: true },
                    { block: 'block', modName: 'mod', modVal: 'val' },
                    { block: 'block', elem: 'elem' },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
                ];

            intersect(decl1, decl2)
                .must.be.empty();
        });

        it('must not intersect other entities from mod of elem', function () {
            var decl1 = [{ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }],
                decl2 = [
                    { block: 'block' },
                    { block: 'block', modName: 'mod', modVal: true },
                    { block: 'block', modName: 'mod', modVal: 'val' },
                    { block: 'block', elem: 'elem' },
                    { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
                ];

            intersect(decl1, decl2)
                .must.be.empty();
        });
    });
});
