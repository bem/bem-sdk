const expect = require('chai').expect;

var T = require('../lib');
var transformer = T();

var BemEntity = require('@bem/entity-name');
// var transform = transformer.process.bind(transformer);

describe('pluginis', () => {

    describe('whiteList', () => {
        it('without opts', () => {
            var res = transformer
                .use(T.plugins.whiteList())
                .process({ block: 'button2' });

            expect(res.JSX).to.equal(
                '<Button2/>'
            );
        });

        it('whiteList', () => {
            var res = transformer
                .use(T.plugins.whiteList({ entities: [{ block: 'button2' }].map(BemEntity.create) }))
                .process({ block: 'button2', content: [{ block: 'menu' }, { block: 'selec' }] });

            expect(res.JSX).to.equal(
                '<Button2/>'
            );
        });
    });

});
