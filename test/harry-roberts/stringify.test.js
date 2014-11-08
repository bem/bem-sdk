var naming = require('../../lib/bem-naming')({ elem: '__', mod: '--' });

describe('harry roberts', function () {
    describe('stringify', function () {
        it('should stringify block', function () {
            var str = naming.stringify({ block: 'block' });

            str.should.equal('block');
        });

        it('should stringify mod of block', function () {
            var str = naming.stringify({
                block: 'block',
                modName: 'mod'
            });

            str.should.equal('block--mod');
        });

        it('should stringify mod of block by strict notation', function () {
            var str = naming.stringify({
                block: 'block',
                modName: 'mod',
                modVal: true
            });

            str.should.equal('block--mod');
        });

        it('should stringify block if `modVal` filed is `undefined`', function () {
            var str = naming.stringify({
                block: 'block',
                modName: 'mod',
                modVal: undefined
            });

            str.should.equal('block');
        });

        it('should stringify elem', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem'
            });

            str.should.equal('block__elem');
        });

        it('should stringify mod of elem', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: true
            });

            str.should.equal('block__elem--mod');
        });

        it('should stringify mod of elem by strict notation', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: true
            });

            str.should.equal('block__elem--mod');
        });

        it('should stringify elem if `modVal` filed is `undefined`', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: undefined
            });

            str.should.equal('block__elem');
        });
    });
});
