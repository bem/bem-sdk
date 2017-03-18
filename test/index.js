const chai = require('chai');
const expect = require('chai').expect;

var transform = require('../lib');

describe('transform', () => {

    it('should return string', () => {
        expect(transform({ block: 'button2' }).toString()).to.be.a('String');
    });

    it('should accept object', () => {
        expect(() => transform({ tag: 'span' })).not.to.throw();
    });

    it('should accept array', () => {
        expect(() => transform([{ tag: 'span' }])).not.to.throw();
    });

    it('should transform block', () => {
        expect(
            transform({ block: 'button2' }).toString()
        ).to.equal(
            '<Button2 />'
        );
    });

    describe('props', () => {
        it('should transform block with string prop', () => {
            expect(
                transform({ block: 'button2', text: 'hello' }).toString()
            ).to.equal(
                '<Button2 text={\'hello\'}/>'
            );
        });

        it('should transform block with bool prop', () => {
            expect(
                transform({ block: 'button2', text: true}).toString()
            ).to.equal(
                '<Button2 text={true}/>'
            );
        });

        it('should transform block with number prop', () => {
            expect(
                transform({ block: 'button2', text: 42}).toString()
            ).to.equal(
                '<Button2 text={42}/>'
            );
        });

        it('should transform block with array prop', () => {
            expect(
                transform({
                    block: 'select2',
                    val: 1,
                    items: [ { val: 1 }, { val: 2 } ]
                }).toString()
            ).to.equal(
                `<Select2 val={1} items={[{ 'val': 1 }, { 'val': 2 }]}/>`
            );
        });

        it('should transform block with object prop', () => {
            expect(
                transform({ block: 'button2', text: 'hello', val: { 42: 42 } }).toString()
            ).to.equal(
                '<Button2 text={\'hello\'} val={{ \'42\': 42 }}/>'
            );
        });

        it('should transform block with nested object prop', () => {
            expect(
                transform({ block: 'button2', text: 'hello', val: { 42: { 42: 42 } } }).toString()
            ).to.equal(
                '<Button2 text={\'hello\'} val={{ \'42\': { \'42\': 42 } }}/>'
            );
        });
    });

    it('should transform several blocks', () => {
        expect(
            transform([
                { block: 'button2', text: 'hello' },
                { block: 'button2', text: 'world' }
            ]).toString()
        ).to.equal(`<Button2 text={'hello'}/>\n<Button2 text={'world'}/>`);
    });

    it('should content with several blocks', () => {
        expect(
            transform([
                { tag: 'span', content: [
                    { block: 'button2', text: 'hello' },
                    { block: 'button2', text: 'world' }
                ]}
            ]).toString()
        ).to.equal(`<span ><Button2 text={'hello'}/>\n<Button2 text={'world'}/></span>`);
    });
});
