const expect = require('chai').expect;
const parse = require('..').convert;
const b_ = require('@bem/entity-name').create;

it('should return an array', () => {
    expect(parse({ block: 'button2' })).to.be.an('Array');
});

it('should return array of zero length if bemjson is empty', () => {
    expect(parse({})).to.have.lengthOf(0);
    expect(parse([])).to.have.lengthOf(0);
});

describe('block', () => {

    it('should extract block', () => {
        expect(parse({ block: 'button2' })).to.eql([b_({ block : 'button2' })]);
    });

    it('should extract block with simple modifier', () => {
        expect(parse({ block: 'popup', mods: { autoclosable: true } })).to.eql([
            b_({ block: 'popup' }),
            b_({ block: 'popup', mod: { name: 'autoclosable' } })
        ]);
    });

    it('should extract block with modifier', () => {
        expect(parse({ block: 'popup', mods: { autoclosable: 'yes' } })).to.eql([
            b_({ block : 'popup' }),
            b_({ block : 'popup', mod : { name : 'autoclosable', val : 'yes' } }),
            b_({ block : 'popup', mod : { name : 'autoclosable' } })
        ]);
    });

    it('should extract block with several modifiers', () => {
        expect(parse({ block: 'popup', mods: { theme: 'normal', autoclosable: true } })).to.eql([
            b_({ block : 'popup' }),
            b_({ block : 'popup', mod : { name : 'theme', val : 'normal' } }),
            b_({ block : 'popup', mod : { name : 'theme' } }),
            b_({ block : 'popup', mod : { name : 'autoclosable' } })
        ]);
    });
});

describe('elem', () => {

    xit('should extract elem', () => {
        expect(parse({ block: 'button2', elem: 'text' })).to.eql([
            b_({ block : 'button2', elem : 'text' })
        ]);
    });

    xit('should extract elem with simple modifier', () => {
        expect(parse({ block: 'button2', elem: 'text', elemMods: { pseudo: true } })).to.eql([
            b_({ block : 'button2', elem : 'text' }),
            b_({ block : 'button2', elem : 'text', mod : { name : 'pseudo' } })
        ]);
    });

    xit('should extract elem with modifier', () => {
        expect(parse({ block: 'button2', elem: 'text', elemMods: { pseudo: 'yes' } })).to.eql([
            b_({ block : 'button2', elem : 'text' }),
            b_({ block : 'button2', elem : 'text', mod : { name : 'pseudo', val : 'yes' } }),
            b_({ block : 'button2', elem : 'text', mod : { name : 'pseudo' } })
        ]);
    });

    xit('should extract elem with several modifiers', () => {
        expect(parse({ block: 'popup', elem: 'tail', elemMods: { theme: 'normal', autoclosable: true } })).to.eql([
            b_({ block : 'popup', elem : 'tail' }),
            b_({ block : 'popup', elem : 'tail', mod : { name : 'theme', val: 'normal' } }),
            b_({ block : 'popup', elem : 'tail', mod : { name : 'theme' } }),
            b_({ block : 'popup', elem : 'tail', mod : { name : 'autoclosable' } })
        ]);
    });

});

describe('content', () => {

    it('content could be obj', () => {
        expect(parse({ content: { block: 'button2' } })).to.eql([b_({ block : 'button2' })]);
    });

    it('connt could be arr', () => {
        expect(parse({ content: [{ block: 'button2' }] })).to.eql([b_({ block : 'button2' })]);
    });

    it('should extract separate blocks', () => {
        expect(parse({ block: 'user2', content: { block: 'button2' } })).to.eql([
            b_({ block: 'user2' }),
            b_({ block: 'button2' })
        ]);
    });

    it('should extract same block only once', () => {
        expect(parse({ block: 'user2', content: { block: 'user2', content: { block: 'user2' } } })).to.eql([
            b_({ block: 'user2' })
        ]);
    });

    it('should extract elems', () => {
        expect(parse({ block: 'button2', content: { block: 'button2', elem: 'text' } })).to.eql([
            b_({ block: 'button2' }),
            b_({ block: 'button2', elem: 'text' })
        ]);
    });

    it('should extract elems using block context', () => {
        expect(parse({ block: 'button2', content: { elem: 'text' } })).to.eql([
            b_({ block: 'button2' }),
            b_({ block: 'button2', elem: 'text' })
        ]);
    });

    xit('should extract elems using elem context', () => {
        expect(parse({ block: 'button2', elem: 'text', content: { elem: 'icon' } })).to.eql([
            b_({ block: 'button2', elem: 'text' }),
            b_({ block: 'button2', elem: 'icon' })
        ]);
    });

});

describe('mix', () => {

    it('mix could be obj', () => {
        expect(parse({ mix: { block: 'button2' } })).to.eql([b_({ block : 'button2' })]);
    });

    it('mix could be arr', () => {
        expect(parse({ mix: [{ block: 'button2' }] })).to.eql([b_({ block : 'button2' })]);
    });

    it('should extract separate blocks', () => {
        expect(parse({ block: 'user2', mix: { block: 'button2' } })).to.eql([
            b_({ block: 'user2' }),
            b_({ block: 'button2' })
        ]);
    });

    it('should extract same block only once', () => {
        expect(parse({ block: 'user2', mix: { block: 'user2', mix: { block: 'user2' } } })).to.eql([
            b_({ block: 'user2' })
        ]);
    });

    it('should extract elems', () => {
        expect(parse({ block: 'button2', mix: { block: 'button2', elem: 'text' } })).to.eql([
            b_({ block: 'button2' }),
            b_({ block: 'button2', elem: 'text' })
        ]);
    });

    it('should extract elems using block context', () => {
        expect(parse({ block: 'button2', mix: { elem: 'text' } })).to.eql([
            b_({ block: 'button2' }),
            b_({ block: 'button2', elem: 'text' })
        ]);
    });

    xit('should extract elems using elem context', () => {
        expect(parse({ block: 'button2', elem: 'text', mix: { elem: 'icon' } })).to.eql([
            b_({ block: 'button2', elem: 'text'}),
            b_({ block: 'button2', elem: 'icon'})
        ]);
    });

});

describe('js', () => {
    it('js keys could be obj', () => {
        expect(parse({ js: { id: { block: 'button2' } } })).to.eql([b_({ block : 'button2' })]);
    });

    it('js keys could be arr', () => {
        expect(parse({ js: { id: [{ block: 'button2' }] } })).to.eql([b_({ block : 'button2' })]);
    });

    it('should extract separate blocks', () => {
        expect(parse({ block: 'user2', js: { id: { block: 'button2' } } })).to.eql([
            b_({ block: 'user2' }),
            b_({ block: 'button2' })
        ]);
    });

    it('should extract same block only once', () => {
        expect(parse({ block: 'user2', js: { id: { block: 'user2', js: { id: { block: 'user2' } } } } })).to.eql([
            b_({ block: 'user2' })
        ]);
    });

    it('should extract elems', () => {
        expect(parse({ block: 'button2', js: { id: { block: 'button2', elem: 'text' } } })).to.eql([
            b_({ block: 'button2' }),
            b_({ block: 'button2', elem: 'text' })
        ]);
    });

    it('should extract elems using block context', () => {
        expect(parse({ block: 'button2', js: { id: { elem: 'text' } } })).to.eql([
            b_({ block: 'button2' }),
            b_({ block: 'button2', elem: 'text' })
        ]);
    });

    xit('should extract elems using elem context', () => {
        expect(parse({ block: 'button2', elem: 'text', js: { id: { elem: 'icon' } } })).to.eql([
            b_({ block: 'button2', elem: 'text' }),
            b_({ block: 'button2', elem: 'icon' })
        ]);
    });


});

describe('attrs', () => {
    it('attrs keys could be obj', () => {
        expect(parse({ attrs: { id: { block: 'button2' } } })).to.eql([b_({ block : 'button2' })]);
    });

    it('attrs keys could be arr', () => {
        expect(parse({ attrs: { id: [{ block: 'button2' }] } })).to.eql([b_({ block : 'button2' })]);
    });

    it('should extract separate blocks', () => {
        expect(parse({ block: 'user2', attrs: { id: { block: 'button2' } } })).to.eql([
            b_({ block: 'user2' }),
            b_({ block: 'button2' })
        ]);
    });

    it('should extract same block only once', () => {
        expect(parse({ block: 'user2', attrs: { id: { block: 'user2', attrs: { id: { block: 'user2' } } } } })).to.eql([
            b_({ block: 'user2' })
        ]);
    });

    it('should extract elems', () => {
        expect(parse({ block: 'button2', attrs: { id: { block: 'button2', elem: 'text' } } })).to.eql([
            b_({ block: 'button2' }),
            b_({ block: 'button2', elem: 'text' })
        ]);
    });

    it('should extract elems using block context', () => {
        expect(parse({ block: 'button2', attrs: { id: { elem: 'text' } } })).to.eql([
            b_({ block: 'button2' }),
            b_({ block: 'button2', elem: 'text' })
        ]);
    });

    xit('should extract elems using elem context', () => {
        expect(parse({ block: 'button2', elem: 'text', attrs: { id: { elem: 'icon' } } })).to.eql([
            b_({ block: 'button2', elem: 'text' }),
            b_({ block: 'button2', elem: 'icon' })
        ]);
    });

});
