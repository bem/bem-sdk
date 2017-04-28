const expect = require('chai').expect;

var T = require('../lib');

var BemEntity = require('@bem/entity-name');

describe('pluginis', () => {

    describe('whiteList', () => {
        it('without opts', () => {
            var res = T()
                .use(T.plugins.whiteList())
                .process({ block: 'button2' });

            expect(res.JSX).to.equal(
                '<Button2/>'
            );
        });

        it('whiteList', () => {
            var res = T()
                .use(T.plugins.whiteList({ entities: [{ block: 'button2' }].map(BemEntity.create) }))
                .process({ block: 'button2', content: [{ block: 'menu' }, { block: 'selec' }] });

            expect(res.JSX).to.equal(
                '<Button2/>'
            );
        });
    });

    describe('stylePropToObj', () => {
        it('styleProp to obj', () => {
            var res = T().process({ block: 'button2', style: 'width:200px' });

            expect(res.JSX).to.equal(
                `<Button2 style={{ 'width': '200px' }}/>`
            );
        });

        it('attrs style to obj', () => {
            var res = T().process({ block: 'button2', attrs: { style: 'width:200px' } });

            expect(res.JSX).to.equal(
                `<Button2 style={{ 'width': '200px' }} attrs={{ 'style': { 'width': '200px' } }}/>`
            );
        });
    });

    describe('keepWhiteSpaces', () => {
        it('should keep spaces before simple text', ()  => {
            var res = T().process({ block: 'button2', content: ' space before' });

            expect(res.JSX).to.equal(
                `<Button2>\n{' space before'}\n</Button2>`
            );
        });

        it('should keep spaces after simple text', ()  => {
            var res = T().process({ block: 'button2', content: 'space after ' });

            expect(res.JSX).to.equal(
                `<Button2>\n{'space after '}\n</Button2>`
            );
        });

        it('should keep spaces before & after simple text', ()  => {
            var res = T().process({ block: 'button2', content: ' space before & after ' });

            expect(res.JSX).to.equal(
                `<Button2>\n{' space before & after '}\n</Button2>`
            );
        });

        it('should keep spaces in only spaces simple text', ()  => {
            var res = T().process({ block: 'button2', content: [' ', '  ', '   ']});

            expect(res.JSX).to.equal(
                `<Button2>\n{' '}\n{'  '}\n{'   '}\n</Button2>`
            );
        });
    });

});
