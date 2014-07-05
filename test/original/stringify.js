var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('stringify', function () {
        it('must not stringify not valid notation', function () {
            naming.stringify.bind(naming, {})
                .must.throw('The field `block` is undefined. It is impossible to stringify BEM notation.');
        });

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

            str.must.equal('block_mod_val');
        });

        it('must stringify boolean mod of block', function () {
            var str = naming.stringify({
                block: 'block',
                modName: 'mod',
                modVal: true
            });

            str.must.equal('block_mod');
        });

        it('must stringify block if `modVal` filed is `undefined`', function () {
            var str = naming.stringify({
                block: 'block',
                modName: 'mod',
                modVal: undefined
            });

            str.must.equal('block');
        });

        it('must not stringify mod of block if `modVal` filed is not specified', function () {
            naming.stringify.bind(naming, { block: 'block', modName: 'modVal' })
                .must.throw('The field `modVal` not specified. It is impossible to stringify BEM notation.');
        });

        it('must stringify elem', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem'
            });

            str.must.equal('block__elem');
        });

        it('must stringify mod of elem', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: 'val'
            });

            str.must.equal('block__elem_mod_val');
        });

        it('must stringify boolean mod of elem', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: true
            });

            str.must.equal('block__elem_mod');
        });

        it('must stringify elem if `modVal` filed is `undefined`', function () {
            var str = naming.stringify({
                block: 'block',
                elem: 'elem',
                modName: 'mod',
                modVal: undefined
            });

            str.must.equal('block__elem');
        });

        it('must not stringify mod of elem if `modVal` filed is not specified', function () {
            naming.stringify.bind(naming, { block: 'block', elem: 'elem', modName: 'modVal' })
                .must.throw('The field `modVal` not specified. It is impossible to stringify BEM notation.');
        });
    });
});
