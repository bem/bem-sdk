var expect = require('chai').expect,
    f = require('..').fillup;

describe('scope', () => {
    describe('block', () => {
        it('should copy block if notation has no block #1', () => {
            expect(f('e:icon', { block : 'button' })).to.eql('b:button e:icon');
        });

        it('should copy block if notation has no block #2', () => {
            expect(f('m:theme=default', { block : 'button' })).to.eql('b:button m:theme=default');
        });

        it('should not copy block if notation has block', () => {
            expect(f('b:button e:icon', { block : 'input' })).to.eql('b:button e:icon');
        });
    });

    describe('elem', () => {
        it('should copy elem if notation has no elem', () => {
            expect(f('m:theme=default', { block : 'button', elem : 'icon' })).to.eql('b:button e:icon m:theme=default');
        });

        it('should not copy elem if notation has elem', () => {
            expect(f('b:button e:icon', { block : 'input', elem : 'clear' })).to.eql('b:button e:icon');
        });
    });
});
