var naming = require('../lib/harry-roberts-naming');

describe('harry roberts', function () {
    describe('stringify', function () {
        it('must stringify block', function () {
            var str = naming.stringify({ block: 'block' });

            str.must.equal('block');
        });

        it('must stringify mod of block', function () {
            var str = naming.stringify({
                block: 'block',
                modName: 'mod',
                modVal: 'val'
            });

            str.must.equal('block--mod--val');
        });

        it('must stringify boolean mod of block', function () {
            var str = naming.stringify({
                block: 'block',
                modName: 'mod'
            });

            str.must.equal('block--mod');
        });

        it('must stringify elem', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem'
            });

            str.must.equal('block-elem');
        });

        it('must stringify mod of elem', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: 'val'
            });

            str.must.equal('block-elem--mod--val');
        });

        it('must stringify boolean mod of elem', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem',
                modName: 'mod'
            });

            str.must.equal('block-elem--mod');
        });
    });
});
