const chai = require('chai');
const expect = require('chai').expect;

var transform = require('..');

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

it('should transform block with prop', () => {
    expect(
        transform({ block: 'button2', text: 'hello' }).toString()
    ).to.equal(
        '<Button2 text="hello"/>'
    );
});
