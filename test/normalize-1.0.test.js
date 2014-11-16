var nomralize = require('../lib/normalize-v1');

describe('nomralize 1.0', function () {

    it('should support objects', function () {
        nomralize({ name: 'block' }, '1.0').should.eql([
            { block: 'block' }
        ]);
    });

describe('mods', function () {
    it('should support objects', function () {
        nomralize({ name: 'block', mods: [{ name: 'mod', vals: [{ name: 'val' }] }]}, '1.0').should.eql([
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: 'val' }
        ]);
    });
});

describe('elems', function () {
    it('should support arrays', function () {
        nomralize({name: 'block', elems: [{name: 'elem-1'}, {name: 'elem-2'}]}, '1.0').should.eql([
            {block: 'block'},
            {block: 'block', elem: 'elem-1'},
            {block: 'block', elem: 'elem-2'}
        ]);
    });

    it('should support objects', function () {
        nomralize({name: 'block', elems: [{name: 'elem', mods: [{name: 'mod', vals: [{ name: 'val'}]}]}]}, '1.0').should.eql([
            {block: 'block'},
            {block: 'block', elem: 'elem'},
            {block: 'block', elem: 'elem', modName: 'mod', modVal: 'val'}
        ]);
    });
});
});
