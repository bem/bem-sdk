var naming = require('../lib/harry-roberts-naming');

describe('harry roberts', function () {
    describe('stringify', function () {
        it('should not stringify not valid notation', function () {
            naming.stringify.bind(naming, {})
                .should.throw('The field `block` is undefined. It is impossible to stringify BEM notation.');
        });

        it('should stringify block', function () {
            var str = naming.stringify({ block: 'block' });

            str.should.equal('block');
        });

        it('should stringify mod of block', function () {
            var str = naming.stringify({
                block: 'block',
                modName: 'mod',
                modVal: 'val'
            });

            str.should.equal('block--mod--val');
        });

        it('should stringify boolean mod of block', function () {
            var str = naming.stringify({
                block: 'block',
                modName: 'mod'
            });

            str.should.equal('block--mod');
        });

        it('should stringify boolean mod of block by strict notation', function () {
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

            str.should.equal('block-elem');
        });

        it('should stringify mod of elem', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: 'val'
            });

            str.should.equal('block-elem--mod--val');
        });

        it('should stringify boolean mod of elem', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: true
            });

            str.should.equal('block-elem--mod');
        });

        it('should stringify boolean mod of elem by strict notation', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: true
            });

            str.should.equal('block-elem--mod');
        });

        it('should stringify elem if `modVal` filed is `undefined`', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: undefined
            });

            str.should.equal('block-elem');
        });
    });
});
