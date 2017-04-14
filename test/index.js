const expect = require('chai').expect;

var transformer = require('../lib')();
var transform = transformer.process.bind(transformer);

describe('transform', () => {

    it('should return string', () => {
        expect(transform({ block: 'button2' }).JSX).to.be.a('String');
    });

    it('should accept object', () => {
        expect(() => transform({ tag: 'span' }).JSX).not.to.throw();
    });

    it('should accept array', () => {
        expect(() => transform([{ tag: 'span' }]).JSX).not.to.throw();
    });

    it('should transform block', () => {
        expect(
            transform({ block: 'button2' }).JSX
        ).to.equal(
            '<Button2 />'
        );
    });

    describe('props', () => {
        it('should transform block with string prop', () => {
            expect(
                transform({ block: 'button2', text: 'hello' }).JSX
            ).to.equal(
                '<Button2 text={\'hello\'}/>'
            );
        });

        it('should transform block with bool prop', () => {
            expect(
                transform({ block: 'button2', text: true}).JSX
            ).to.equal(
                '<Button2 text={true}/>'
            );
        });

        it('should transform block with number prop', () => {
            expect(
                transform({ block: 'button2', text: 42}).JSX
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
                }).JSX
            ).to.equal(
                `<Select2 val={1} items={[{ 'val': 1 }, { 'val': 2 }]}/>`
            );
        });

        it('should transform block with object prop', () => {
            expect(
                transform({ block: 'button2', text: 'hello', val: { 42: 42 } }).JSX
            ).to.equal(
                '<Button2 text={\'hello\'} val={{ \'42\': 42 }}/>'
            );
        });

        it('should transform block with nested object prop', () => {
            expect(
                transform({ block: 'button2', text: 'hello', val: { 42: { 42: 42 } } }).JSX
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
            ]).JSX
        ).to.equal(`<Button2 text={'hello'}/>\n<Button2 text={'world'}/>`);
    });

    it('should content with several blocks', () => {
        expect(
            transform([
                { tag: 'span', content: [
                    { block: 'button2', text: 'hello' },
                    { block: 'button2', text: 'world' }
                ]}
            ]).JSX
        ).to.equal(`<span ><Button2 text={'hello'}/>\n<Button2 text={'world'}/></span>`);
    });

    it('should treat mods as props', () => {
        expect(
            transform({ block: 'button2',  mods: {theme: 'normal', size: 's'} }).JSX
        ).to.equal(`<Button2 theme={'normal'} size={'s'}/>`);
    });

    it('should provide mix as obj', () => {
        expect(
            transform({ block: 'button2',  mix: {block: 'header', elem: 'button' } }).JSX
        ).to.equal(`<Button2 mix={{ 'block': 'header', 'elem': 'button' }}/>`);
    });
});
