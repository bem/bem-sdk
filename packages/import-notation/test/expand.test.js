var expect = require('chai').expect,
    e = require('..').expand;

it('should return notation if no ctx specified', () => {
    expect(e('b:button')).to.eql('b:button');
});

describe('ctx', () => {
    describe('block', () => {
        it('should copy block if notation has no block', () => {
            expect(e('e:icon', { block : 'button' })).to.eql('b:button e:icon');
        });

        it('should not copy block if notation has block', () => {
            expect(e('b:button e:icon', { block : 'input' })).to.eql('b:button e:icon');
        });
    });

    describe('elem', () => {
        it('should copy elem if notation has no elem', () => {
            expect(e('m:theme=default', { block : 'button', elem : 'icon' })).to.eql('b:button e:icon m:theme=default');
        });

        it('should not copy elem if notation has elem', () => {
            expect(e('b:button e:icon', { block : 'input', elem : 'clear' })).to.eql('b:button e:icon');
        });
    });
});
