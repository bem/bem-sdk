var merge = require('../lib/index').merge;

describe('merge', function () {
    describe('sets', function () {
        it('must support only one decl', function () {
            var decl1 = [{ block: 'block' }];

            merge(decl1).must.eql([
                { block: 'block' }
            ]);
        });

        it('must support several decls', function () {
            var decl1 = [{ block: 'block-1' }],
                decl2 = [{ block: 'block-2' }],
                decl3 = [{ block: 'block-3' }];

            merge(decl1, decl2, decl3).must.eql([
                { block: 'block-1' },
                { block: 'block-2' },
                { block: 'block-3' }
            ]);
        });

        it('must return set', function () {
            var decl1 = [{ block: 'block' }],
                decl2 = [{ block: 'block' }];

            merge(decl1, decl2).must.eql([
                { block: 'block' }
            ]);
        });

        it('must merge set with empty set', function () {
            var decl1 = [{ block: 'block' }],
                decl2 = [];

            merge(decl1, decl2).must.eql([
                { block: 'block' }
            ]);
        });

        it('must merge disjoint sets', function () {
            var decl1 = [{ block: 'block-1' }],
                decl2 = [{ block: 'block-2' }];

            merge(decl1, decl2).must.eql([
                { block: 'block-1' },
                { block: 'block-2' }
            ]);
        });

        it('must merge intersecting sets', function () {
            var decl1 = [{ block: 'block-1' }, { block: 'block-2' }, { block: 'block-3' }],
                decl2 = [{ block: 'block-2' }];

            merge(decl1, decl2).must.eql([
                { block: 'block-1' },
                { block: 'block-2' },
                { block: 'block-3' }
            ]);
        });
    });

    describe('bem', function () {
        it('must merge block with its elem', function () {
            var decl1 = [{ block: 'block' }],
                decl2 = [{ block: 'block', elem: 'elem' }];

            merge(decl1, decl2).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' }
            ]);
        });

        it('must merge block with its mod', function () {
            var decl1 = [{ block: 'block' }],
                decl2 = [{ block: 'block', modName: 'mod', modVal: 'val' }];

            merge(decl1, decl2).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must merge block with its bool mod', function () {
            var decl1 = [{ block: 'block' }],
                decl2 = [{ block: 'block', modName: 'bool-mod', modVal: true }];

            merge(decl1, decl2).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'bool-mod', modVal: true }
            ]);
        });

        it('must merge elems of block', function () {
            var decl1 = [{ block: 'block', elem: 'elem-1' }],
                decl2 = [{ block: 'block', elem: 'elem-2' }];

            merge(decl1, decl2).must.eql([
                { block: 'block', elem: 'elem-1' },
                { block: 'block', elem: 'elem-2' }
            ]);
        });

        it('must merge mods of block', function () {
            var decl1 = [{ block: 'block', modName: 'mod-1', modVal: true }],
                decl2 = [{ block: 'block', modName: 'mod-2', modVal: true }];

            merge(decl1, decl2).must.eql([
                { block: 'block', modName: 'mod-1', modVal: true },
                { block: 'block', modName: 'mod-2', modVal: true }
            ]);
        });

        it('must merge mod vals of block mod', function () {
            var decl1 = [{ block: 'block', modName: 'mod', modVal: 'val-1' }],
                decl2 = [{ block: 'block', modName: 'mod', modVal: 'val-2' }];

            merge(decl1, decl2).must.eql([
                { block: 'block', modName: 'mod', modVal: 'val-1' },
                { block: 'block', modName: 'mod', modVal: 'val-2' }
            ]);
        });

        it('must merge elem with its mod', function () {
            var decl1 = [{ block: 'block', elem: 'elem' }],
                decl2 = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val' }];

            merge(decl1, decl2).must.eql([
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must merge elem with its bool mod', function () {
            var decl1 = [{ block: 'block', elem: 'elem' }],
                decl2 = [{ block: 'block', elem: 'elem' , modName: 'bool-mod', modVal: true }];

            merge(decl1, decl2).must.eql([
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem' , modName: 'bool-mod', modVal: true }
            ]);
        });

        it('must merge mods of elem', function () {
            var decl1 = [{ block: 'block', elem: 'elem', modName: 'mod-1', modVal: true }],
                decl2 = [{ block: 'block', elem: 'elem', modName: 'mod-2', modVal: true }];

            merge(decl1, decl2).must.eql([
                { block: 'block', elem: 'elem', modName: 'mod-1', modVal: true },
                { block: 'block', elem: 'elem', modName: 'mod-2', modVal: true }
            ]);
        });

        it('must merge mod vals of elem mod', function () {
            var decl1 = [{ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-1' }],
                decl2 = [{ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-2' }];

            merge(decl1, decl2).must.eql([
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-1' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-2' }
            ]);
        });
    });
});
