var expect = require('chai').expect,
    s = require('..').stringify;

it('should return a string', () => {
    expect(s([{ block : 'button' }])).to.be.an('String');
});

describe('block', () => {
    it('should stringify block', () => {
        expect(s({ block : 'button' })).to.be.equal('b:button');
    });

    it('should stringify block with simple modifier', () => {
        expect(s([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'autoclosable' } }
        ])).to.be.equal('b:popup m:autoclosable');
    });

    it('should stringify block with explicit simple modifier', () => {
        expect(s([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'autoclosable', val : true } }
        ])).to.be.equal('b:popup m:autoclosable');
    });

    it('should stringify block with number modifier', () => {
        expect(s([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'fuck', val : 42 } }
        ])).to.be.equal('b:popup m:fuck=42');
    });

    it('should stringify block with modifier', () => {
        expect(s([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'autoclosable' } },
            { block : 'popup', mod : { name : 'autoclosable', val : 'yes' } }
        ])).to.equal('b:popup m:autoclosable=yes');
    });

    it('should stringify block with modifier and several values', () => {
        expect(s([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'theme' } },
            { block : 'popup', mod : { name : 'theme', val : 'normal' } },
            { block : 'popup', mod : { name : 'theme', val : 'action' } }
        ])).to.equal('b:popup m:theme=normal|action');
    });

    it('should stringify block with several modifiers', () => {
        expect(s([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'theme' } },
            { block : 'popup', mod : { name : 'autoclosable' } }
        ])).to.equal('b:popup m:theme m:autoclosable');
    });

    it('should stringify block with several modifiers and several values', () => {
        expect(s([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'theme' } },
            { block : 'popup', mod : { name : 'theme', val : 'normal' } },
            { block : 'popup', mod : { name : 'theme', val : 'action' } },
            { block : 'popup', mod : { name : 'autoclosable' } },
            { block : 'popup', mod : { name : 'autoclosable', val : 'yes' } }
        ])).to.equal('b:popup m:theme=normal|action m:autoclosable=yes');
    });
});

describe('elem', () => {
    it('should stringify elem', () => {
        expect(s([{ block : 'button', elem : 'text' }])).to.be.equal('b:button e:text');
    });

    it('should stringify elem with simple modifier', () => {
        expect(s([
            { block : 'button2', elem : 'text' },
            { block : 'button2', elem : 'text', mod : { name : 'pseudo' } }
        ])).to.equal('b:button2 e:text m:pseudo');
    });

    it('should stringify elem with modifier', () => {
        expect(s([
            { block : 'button2', elem : 'text' },
            { block : 'button2', elem : 'text', mod : { name : 'pseudo' } },
            { block : 'button2', elem : 'text', mod : { name : 'pseudo', val : 'yes' } }
        ])).to.equal('b:button2 e:text m:pseudo=yes');
    });

    it('should stringify elem with modifier and several values', () => {
        expect(s([
            { block : 'button2', elem : 'text' },
            { block : 'button2', elem : 'text', mod : { name : 'theme' } },
            { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'normal' } },
            { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'action' } }
        ])).to.equal('b:button2 e:text m:theme=normal|action');
    });

    it('should stringify elem with several modifiers', () => {
        expect(s([
            { block : 'popup', elem : 'tail' },
            { block : 'popup', elem : 'tail', mod : { name : 'theme' } },
            { block : 'popup', elem : 'tail', mod : { name : 'autoclosable' } }
        ])).to.equal('b:popup e:tail m:theme m:autoclosable');
    });

    it('should stringify elem with several modifiers and several values', () => {
        expect(s([
            { block : 'popup', elem : 'tail' },
            { block : 'popup', elem : 'tail', mod : { name : 'theme' } },
            { block : 'popup', elem : 'tail', mod : { name : 'theme', val : 'normal' } },
            { block : 'popup', elem : 'tail', mod : { name : 'theme', val : 'action' } },
            { block : 'popup', elem : 'tail', mod : { name : 'autoclosable' } },
            { block : 'popup', elem : 'tail', mod : { name : 'autoclosable', val : 'yes' } }
        ])).to.equal('b:popup e:tail m:theme=normal|action m:autoclosable=yes');
    });
});

describe('tech', () => {
    it('should stringify block with tech', () => {
        expect(s({ block : 'button', tech : 'css' })).to.be.equal('b:button t:css');
    });

    it('should stringify block with mod and tech', () => {
        expect(s([
            { block : 'popup', tech : 'js' },
            { block : 'popup', mod : { name : 'autoclosable' }, tech : 'js' },
            { block : 'popup', mod : { name : 'autoclosable', val : 'yes' }, tech : 'js' }
        ])).to.be.equal('b:popup m:autoclosable=yes t:js');
    });
});
