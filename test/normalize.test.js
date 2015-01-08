var normalize = require('../lib/index').normalize;

describe('normalize', function () {
    it('must support undefined', function () {
        normalize().must.eql([]);
    });

    it('must support empty array', function () {
        normalize([]).must.eql([]);
    });

    it('must support objects', function () {
        normalize({ name: 'block' }).must.eql([
            { block: 'block' }
        ]);
    });

    it('must support array', function () {
        normalize([{ name: 'A' }, { name: 'B' }]).must.eql([
            { block: 'A' }, { block: 'B' }
        ]);
    });

    describe('mods', function () {
        it('must support objects', function () {
            normalize({ name: 'block', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] }).must.eql([
                { block: 'block' },
                { block: 'block', modName: 'mod', modVal: 'val' }
            ]);
        });
    });

    describe('elems', function () {
        it('must support arrays', function () {
            normalize({
                name: 'block',
                elems: [{ name: 'elem-1' }, { name: 'elem-2' }]
            }).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem-1' },
                { block: 'block', elem: 'elem-2' }
            ]);
        });

        it('must support objects', function () {
            normalize({
                name: 'block',
                elems: [{ name: 'elem', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] }]
            }).must.eql([
                { block: 'block' },
                { block: 'block', elem: 'elem' },
                { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            ]);
        });
    });
});
