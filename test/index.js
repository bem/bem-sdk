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
