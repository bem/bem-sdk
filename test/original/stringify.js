var naming = require('../../lib/bem-naming');

describe('original', function () {
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

            str.should.equal('block_mod_val');
        });

        it('should stringify boolean mod of block', function () {
            var str = naming.stringify({
                block: 'block',
                modName: 'mod',
                modVal: true
            });

            str.should.equal('block_mod');
        });

        it('should stringify block if `modVal` filed is `undefined`', function () {
            var str = naming.stringify({
                block: 'block',
                modName: 'mod',
                modVal: undefined
            });

            str.should.equal('block');
        });

        it('should not stringify mod of block if `modVal` filed is not specified', function () {
            naming.stringify.bind(naming, { block: 'block', modName: 'modVal' })
                .should.throw('The field `modVal` not specified. It is impossible to stringify BEM notation.');
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
                modVal: 'val'
            });

            str.should.equal('block__elem_mod_val');
        });

        it('should stringify boolean mod of elem', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: true
            });

            str.should.equal('block__elem_mod');
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

        it('should not stringify mod of elem if `modVal` filed is not specified', function () {
            naming.stringify.bind(naming, { block: 'block', elem: 'elem', modName: 'modVal' })
                .should.throw('The field `modVal` not specified. It is impossible to stringify BEM notation.');
        });
    });
});
