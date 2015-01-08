var normalize = require('../lib/index').normalize;

describe('normalize', function () {
    it('must support undefined', function () {
        normalize().must.eql([]);
    });

    it('must support empty array', function () {
        normalize([]).must.eql([]);
    });

    it('must support objects', function () {
        var entities = { name: 'block' };

        normalize(entities).must.eql([
            { block: 'block' }
        ]);
    });

    it('must support array', function () {
        var entities = [
            { name: 'block-1' },
            { name: 'block-2' }
        ];

        normalize(entities).must.eql([
            { block: 'block-1' },
            { block: 'block-2' }
        ]);
    });

    describe('mods', function () {
        it('must support objects', function () {
            var entities = { name: 'block', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support shortcat for boolean mod as objects', function () {
            var entities = { name: 'block', mods: [{ name: 'mod' }] };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: true }
            ]);
        });
    });

    describe('elems', function () {
        it('must support arrays', function () {
            var entities = {
                name: 'block',
                elems: [
                    { name: 'elem-1' },
                    { name: 'elem-2' }
                ]
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem-1' },
                { block: 'block', elem: 'elem-2' }
            ]);
        });

        it('must support objects', function () {
            var entities = {
                name: 'block',
                elems: [
                    { name: 'elem', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] }
                ]
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });

        it('must support shortcat for boolean mod as objects', function () {
            var entities = {
                name: 'block',
                elems: [
                    { name: 'elem', mods: [{ name: 'mod' }] }
                ]
            };

            normalize(entities).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
            ]);
        });
    });
});
