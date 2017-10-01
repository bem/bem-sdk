'use strict';

const chai = require('chai');
chai.use(require('./helpers'));
const expect = require('chai').expect;

const parse = require('..').convert;

it('should return an array', () => {
    expect(parse({ block: 'button2' })).to.be.an('Array');
});

it('should return array of zero length if bemjson is empty', () => {
    expect(parse({})).to.have.lengthOf(0);
    expect(parse([])).to.have.lengthOf(0);
    expect(parse([null])).to.have.lengthOf(0);
});

describe('block', () => {

    it('should extract block', () => {
        expect(parse({ block: 'button2' })).to.bemeql([{ block : 'button2' }]);
    });

    it('should extract block with simple modifier', () => {
        expect(parse({ block: 'popup', mods: { autoclosable: true } })).to.bemeql([
            { block: 'popup' },
            { block: 'popup', mod: { name: 'autoclosable' } }
        ]);
    });

    it('should extract block with modifier', () => {
        expect(parse({ block: 'popup', mods: { autoclosable: 'yes' } })).to.bemeql([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'autoclosable' } },
            { block : 'popup', mod : { name : 'autoclosable', val : 'yes' } }
        ]);
    });

    it('should extract block with several modifiers', () => {
        expect(parse({ block: 'popup', mods: { theme: 'normal', autoclosable: true } })).to.bemeql([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'theme' } },
            { block : 'popup', mod : { name : 'theme', val : 'normal' } },
            { block : 'popup', mod : { name : 'autoclosable' } }
        ]);
    });

    it('should not extract block modifier from elemMod', () => {
        expect(parse({ block: 'popup', elemMods: { autoclosable: true } })).to.not.bemeql([
            { block: 'popup' },
            { block: 'popup', mod: { name: 'autoclosable' } }
        ]);
    });
});

describe('elem', () => {

    it('should extract elem', () => {
        expect(parse({ block: 'button2', elem: 'text' })).to.bemeql([
            { block : 'button2', elem : 'text' }
        ]);
    });

    it('should extract elem with simple modifier', () => {
        expect(parse({ block: 'button2', elem: 'text', elemMods: { pseudo: true } })).to.bemeql([
            { block : 'button2', elem : 'text' },
            { block : 'button2', elem : 'text', mod : { name : 'pseudo' } }
        ]);
    });

    it('should extract elem with modifier', () => {
        expect(parse({ block: 'button2', elem: 'text', elemMods: { pseudo: 'yes' } })).to.bemeql([
            { block : 'button2', elem : 'text' },
            { block : 'button2', elem : 'text', mod : { name : 'pseudo' } },
            { block : 'button2', elem : 'text', mod : { name : 'pseudo', val : 'yes' } },
        ]);
    });

    it('should extract elem with several modifiers', () => {
        expect(parse({ block: 'popup', elem: 'tail', elemMods: { theme: 'normal', autoclosable: true } })).to.bemeql([
            { block : 'popup', elem : 'tail' },
            { block : 'popup', elem : 'tail', mod : { name : 'theme' } },
            { block : 'popup', elem : 'tail', mod : { name : 'theme', val: 'normal' } },
            { block : 'popup', elem : 'tail', mod : { name : 'autoclosable' } }
        ]);
    });

    it('should not extract elem modifier from blocks mod', () => {
        expect(parse({ block: 'button2', elem: 'text', mods: { pseudo: true } })).to.not.bemeql([
            { block : 'button2', elem : 'text' },
            { block : 'button2', elem : 'text', mod : { name : 'pseudo' } }
        ]);
    });
});

describe('content', () => {

    it('content could be obj', () => {
        expect(parse({ content: { block: 'button2' } })).to.bemeql([{ block : 'button2' }]);
    });

    it('connt could be arr', () => {
        expect(parse({ content: [{ block: 'button2' }] })).to.bemeql([{ block : 'button2' }]);
    });

    it('should extract separate blocks', () => {
        expect(parse({ block: 'user2', content: { block: 'button2' } })).to.bemeql([
            { block: 'user2' },
            { block: 'button2' }
        ]);
    });

    it('should extract same block only once', () => {
        expect(parse({ block: 'user2', content: { block: 'user2', content: { block: 'user2' } } })).to.bemeql([
            { block: 'user2' }
        ]);
    });

    it('should extract elems', () => {
        expect(parse({ block: 'button2', content: { block: 'button2', elem: 'text' } })).to.bemeql([
            { block: 'button2' },
            { block: 'button2', elem: 'text' }
        ]);
    });

    it('should extract elems using block context', () => {
        expect(parse({ block: 'button2', content: { elem: 'text' } })).to.bemeql([
            { block: 'button2' },
            { block: 'button2', elem: 'text' }
        ]);
    });

    it('should extract elems using elem context', () => {
        expect(parse({ block: 'button2', elem: 'text', content: { elem: 'icon' } })).to.bemeql([
            { block: 'button2', elem: 'text' },
            { block: 'button2', elem: 'icon' }
        ]);
    });

});

describe('mix', () => {

    it('mix could be obj', () => {
        expect(parse({ mix: { block: 'button2' } })).to.bemeql([{ block : 'button2' }]);
    });

    it('mix could be arr', () => {
        expect(parse({ mix: [{ block: 'button2' }] })).to.bemeql([{ block : 'button2' }]);
    });

    it('should extract separate blocks', () => {
        expect(parse({ block: 'user2', mix: { block: 'button2' } })).to.bemeql([
            { block: 'user2' },
            { block: 'button2' }
        ]);
    });

    it('should extract same block only once', () => {
        expect(parse({ block: 'user2', mix: { block: 'user2', mix: { block: 'user2' } } })).to.bemeql([
            { block: 'user2' }
        ]);
    });

    it('should extract elems', () => {
        expect(parse({ block: 'button2', mix: { block: 'button2', elem: 'text' } })).to.bemeql([
            { block: 'button2' },
            { block: 'button2', elem: 'text' }
        ]);
    });

    it('should extract elems using block context', () => {
        expect(parse({ block: 'button2', mix: { elem: 'text' } })).to.bemeql([
            { block: 'button2' },
            { block: 'button2', elem: 'text' }
        ]);
    });

    it('should extract elems using elem context', () => {
        expect(parse({ block: 'button2', elem: 'text', mix: { elem: 'icon' } })).to.bemeql([
            { block: 'button2', elem: 'text'},
            { block: 'button2', elem: 'icon'}
        ]);
    });

});

describe('js', () => {
    it('js keys could be obj', () => {
        expect(parse({ js: { id: { block: 'button2' } } })).to.bemeql([{ block : 'button2' }]);
    });

    it('js keys could be arr', () => {
        expect(parse({ js: { id: [{ block: 'button2' }] } })).to.bemeql([{ block : 'button2' }]);
    });

    it('should extract separate blocks', () => {
        expect(parse({ block: 'user2', js: { id: { block: 'button2' } } })).to.bemeql([
            { block: 'user2' },
            { block: 'button2' }
        ]);
    });

    it('should extract same block only once', () => {
        expect(parse({ block: 'user2', js: { id: { block: 'user2', js: { id: { block: 'user2' } } } } })).to.bemeql([
            { block: 'user2' }
        ]);
    });

    it('should extract elems', () => {
        expect(parse({ block: 'button2', js: { id: { block: 'button2', elem: 'text' } } })).to.bemeql([
            { block: 'button2' },
            { block: 'button2', elem: 'text' }
        ]);
    });

    it('should extract elems using block context', () => {
        expect(parse({ block: 'button2', js: { id: { elem: 'text' } } })).to.bemeql([
            { block: 'button2' },
            { block: 'button2', elem: 'text' }
        ]);
    });

    it('should extract elems using elem context', () => {
        expect(parse({ block: 'button2', elem: 'text', js: { id: { elem: 'icon' } } })).to.bemeql([
            { block: 'button2', elem: 'text' },
            { block: 'button2', elem: 'icon' }
        ]);
    });
});

describe('attrs', () => {
    it('attrs keys could be obj', () => {
        expect(parse({ attrs: { id: { block: 'button2' } } })).to.bemeql([{ block : 'button2' }]);
    });

    it('attrs keys could be arr', () => {
        expect(parse({ attrs: { id: [{ block: 'button2' }] } })).to.bemeql([{ block : 'button2' }]);
    });

    it('should extract separate blocks', () => {
        expect(parse({ block: 'user2', attrs: { id: { block: 'button2' } } })).to.bemeql([
            { block: 'user2' },
            { block: 'button2' }
        ]);
    });

    it('should extract same block only once', () => {
        expect(parse({ block: 'user2', attrs: { id: { block: 'user2', attrs: { id: { block: 'user2' } } } } })).to.bemeql([
            { block: 'user2' }
        ]);
    });

    it('should extract elems', () => {
        expect(parse({ block: 'button2', attrs: { id: { block: 'button2', elem: 'text' } } })).to.bemeql([
            { block: 'button2' },
            { block: 'button2', elem: 'text' }
        ]);
    });

    it('should extract elems using block context', () => {
        expect(parse({ block: 'button2', attrs: { id: { elem: 'text' } } })).to.bemeql([
            { block: 'button2' },
            { block: 'button2', elem: 'text' }
        ]);
    });

    it('should extract elems using elem context', () => {
        expect(parse({ block: 'button2', elem: 'text', attrs: { id: { elem: 'icon' } } })).to.bemeql([
            { block: 'button2', elem: 'text' },
            { block: 'button2', elem: 'icon' }
        ]);
    });
});

describe('aggressive', () => {
    it('should resolve custom props object', () => {
        expect(parse({ block: 'button2', icon: { block: 'icon' } })).to.bemeql([
            { block: 'button2' },
            { block: 'icon' }
        ]);
    });

    it('should resolve custom props array', () => {
        expect(parse({ block: 'button2', icon: [{ block: 'icon' }, { block: 'input', elem: 'control' }] }, {}, { aggressive: true })).to.bemeql([
            { block: 'button2' },
            { block: 'icon' },
            { block: 'input', elem: 'control' }
        ]);
    });
});
