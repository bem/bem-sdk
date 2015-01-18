var merge = require('../lib/index').merge;

describe('merge', function () {
    describe('sets', function () {
        it('must support only one decl', function () {
            var decl = [{ block: 'block' }];

            merge(decl)
                .must.eql(decl);
        });

        it('must support several decls', function () {
            var A = [{ block: 'A' }],
                B = [{ block: 'B' }],
                C = [{ block: 'C' }];

            merge(A, B, C)
                .must.eql([].concat(A, B, C));
        });

        it('must return set', function () {
            var decl = [{ block: 'block' }];

            merge(decl, decl)
                .must.eql(decl);
        });

        it('must merge set with empty set', function () {
            var decl = [{ block: 'block' }];

            merge(decl, [])
                .must.eql(decl);
        });

        it('must merge disjoint sets', function () {
            var A = [{ block: 'A' }],
                B = [{ block: 'B' }];

            merge(A, B)
                .must.eql([].concat(A, B));
        });

        it('must merge intersecting sets', function () {
            var ABC = [{ block: 'A' }, { block: 'B' }, { block: 'C' }],
                B = [{ block: 'B' }];

            merge(ABC, B)
                .must.eql(ABC);
        });
    });

    describe('bem', function () {
        it('must merge block with its elem', function () {
            var block = { block: 'block' },
                elem = { block: 'block', elem: 'elem' };

            merge([block], [elem])
                .must.eql([block, elem]);
        });

        it('must merge block with its mod', function () {
            var block = { block: 'block' },
                mod = { block: 'block', modName: 'mod', modVal: 'val' };

            merge([block], [mod])
                .must.eql([block, mod]);
        });

        it('must merge block with its bool mod', function () {
            var block = { block: 'block' },
                mod = { block: 'block', modName: 'mod', modVal: true };

            merge([block], [mod])
                .must.eql([block, mod]);
        });

        it('must merge elems of block', function () {
            var elem1 = { block: 'block', elem: 'elem-1' },
                elem2 = { block: 'block', elem: 'elem-2' };

            merge([elem1], [elem2])
                .must.eql([elem1, elem2]);
        });

        it('must merge mods of block', function () {
            var mod1 = { block: 'block', modName: 'mod-1', modVal: true },
                mod2 = { block: 'block', modName: 'mod-2', modVal: true };

            merge([mod1], [mod2])
                .must.eql([mod1, mod2]);
        });

        it('must merge mod vals of block mod', function () {
            var val1 = { block: 'block', modName: 'mod', modVal: 'val-1' },
                val2 = { block: 'block', modName: 'mod', modVal: 'val-2' };

            merge([val1], [val2])
                .must.eql([val1, val2]);
        });

        it('must merge elem with its mod', function () {
            var elem = { block: 'block', elem: 'elem' },
                mod = { block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val' };

            merge([elem], [mod])
                .must.eql([elem, mod]);
        });

        it('must merge elem with its bool mod', function () {
            var elem = { block: 'block', elem: 'elem' },
                mod = { block: 'block', elem: 'elem' , modName: 'mod', modVal: true };

            merge([elem], [mod])
                .must.eql([elem, mod]);
        });

        it('must merge mods of elem', function () {
            var mod1 = { block: 'block', elem: 'elem', modName: 'mod-1', modVal: true },
                mod2 = { block: 'block', elem: 'elem', modName: 'mod-2', modVal: true };

            merge([mod1], [mod2])
                .must.eql([mod1, mod2]);
        });

        it('must merge mod vals of elem mod', function () {
            var val1 = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-1' },
                val2 = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-2' };

            merge([val1], [val2])
                .must.eql([val1, val2]);
        });
    });
});
