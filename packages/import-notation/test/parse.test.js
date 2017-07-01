var expect = require('chai').expect,
    p = require('..').parse;

it('should return an array', () => {
    expect(p('b:button')).to.be.an('Array');
});

it('should return array of zero length if nothing matched', () => {
    expect(p('@bem/sdk.cell')).to.have.lengthOf(0);
});

describe('block', () => {
    it('should extract block', () => {
        expect(p('b:button2')).to.eql([{ block : 'button2' }]);
    });

    it('should extract block with simple modifier', () => {
        expect(p('b:popup m:autoclosable')).to.eql([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'autoclosable' } }
        ]);
    });

    it('should extract block with modifier', () => {
        expect(p('b:popup m:autoclosable=yes')).to.eql([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'autoclosable' } },
            { block : 'popup', mod : { name : 'autoclosable', val : 'yes' } }
        ]);
    });

    it('should extract block with modifier and several values', () => {
        expect(p('b:popup m:theme=normal|action')).to.eql([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'theme' } },
            { block : 'popup', mod : { name : 'theme', val : 'normal' } },
            { block : 'popup', mod : { name : 'theme', val : 'action' } }
        ]);
    });

    it('should extract block with several modifiers', () => {
        expect(p('b:popup m:theme m:autoclosable')).to.eql([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'theme' } },
            { block : 'popup', mod : { name : 'autoclosable' } }
        ]);
    });

    it('should extract block with several modifiers and several values', () => {
        expect(p('b:popup m:theme=normal|action m:autoclosable=yes')).to.eql([
            { block : 'popup' },
            { block : 'popup', mod : { name : 'theme' } },
            { block : 'popup', mod : { name : 'theme', val : 'normal' } },
            { block : 'popup', mod : { name : 'theme', val : 'action' } },
            { block : 'popup', mod : { name : 'autoclosable' } },
            { block : 'popup', mod : { name : 'autoclosable', val : 'yes' } }
        ]);
    });

    describe('ctx', () => {
        describe('context is block', () => {
            it('should extract blockMod', () => {
                expect(p('m:autoclosable', { block : 'popup' })).to.eql([
                    { block : 'popup', mod : { name : 'autoclosable' } }
                ]);
            });

            it('should extract block with modifier', () => {
                expect(p('m:autoclosable=yes', { block : 'popup' })).to.eql([
                    { block : 'popup', mod : { name : 'autoclosable' } },
                    { block : 'popup', mod : { name : 'autoclosable', val : 'yes' } }
                ]);
            });

            it('should extract blockMod with several values', () => {
                expect(p('m:theme=normal|action', { block : 'popup' })).to.eql([
                    { block : 'popup', mod : { name : 'theme' } },
                    { block : 'popup', mod : { name : 'theme', val : 'normal' } },
                    { block : 'popup', mod : { name : 'theme', val : 'action' } }
                ]);
            });

            it('should extract blockMod with several modifiers', () => {
                expect(p('m:theme m:autoclosable', { block : 'popup' })).to.eql([
                    { block : 'popup', mod : { name : 'theme' } },
                    { block : 'popup', mod : { name : 'autoclosable' } }
                ]);
            });

            it('should extract blockMods with several modifiers and several values', () => {
                expect(p('m:theme=normal|action m:autoclosable=yes', { block : 'popup' })).to.eql([
                    { block : 'popup', mod : { name : 'theme' } },
                    { block : 'popup', mod : { name : 'theme', val : 'normal' } },
                    { block : 'popup', mod : { name : 'theme', val : 'action' } },
                    { block : 'popup', mod : { name : 'autoclosable' } },
                    { block : 'popup', mod : { name : 'autoclosable', val : 'yes' } }
                ]);
            });
        });

        describe('context is elem of another block', () => {
            it('should extract block', () => {
                expect(p('b:popup'), { block : 'button2', elem : 'tail' }).to.eql([
                    { block : 'popup' }
                ]);
            });

            it('should extract block with simple modifier', () => {
                expect(p('b:popup m:autoclosable', { block : 'button2', elem : 'tail' })).to.eql([
                    { block : 'popup' },
                    { block : 'popup', mod : { name : 'autoclosable' } }
                ]);
            });

            it('should extract block with modifier', () => {
                expect(p('b:popup m:autoclosable=yes', { block : 'button2', elem : 'tail' })).to.eql([
                    { block : 'popup' },
                    { block : 'popup', mod : { name : 'autoclosable' } },
                    { block : 'popup', mod : { name : 'autoclosable', val : 'yes' } }
                ]);
            });

            it('should extract block with modifier and several values', () => {
                expect(p('b:popup m:theme=normal|action', { block : 'button2', elem : 'tail' })).to.eql([
                    { block : 'popup' },
                    { block : 'popup', mod : { name : 'theme' } },
                    { block : 'popup', mod : { name : 'theme', val : 'normal' } },
                    { block : 'popup', mod : { name : 'theme', val : 'action' } }
                ]);
            });

            it('should extract block with several modifiers', () => {
                expect(p('b:popup m:theme m:autoclosable', { block : 'button2', elem : 'tail' })).to.eql([
                    { block : 'popup' },
                    { block : 'popup', mod : { name : 'theme' } },
                    { block : 'popup', mod : { name : 'autoclosable' } }
                ]);
            });

            it('should extract block with several modifiers and several values', () => {
                expect(
                    p('b:popup m:theme=normal|action m:autoclosable=yes', { block : 'button2', elem : 'tail' })
                ).to.eql([
                    { block : 'popup' },
                    { block : 'popup', mod : { name : 'theme' } },
                    { block : 'popup', mod : { name : 'theme', val : 'normal' } },
                    { block : 'popup', mod : { name : 'theme', val : 'action' } },
                    { block : 'popup', mod : { name : 'autoclosable' } },
                    { block : 'popup', mod : { name : 'autoclosable', val : 'yes' } }
                ]);
            });
        });

        describe('context is elem of current block', () => {
            it('should extract block', () => {
                expect(p('b:popup', { block : 'popup', elem : 'tail' })).to.eql([
                    { block : 'popup' }
                ]);
            });

            it('should extract block with simple modifier', () => {
                expect(p('b:popup m:autoclosable', { block : 'popup', elem : 'tail' })).to.eql([
                    { block : 'popup' },
                    { block : 'popup', mod : { name : 'autoclosable' } }
                ]);
            });

            it('should extract block with modifier', () => {
                expect(p('b:popup m:autoclosable=yes', { block : 'popup', elem : 'tail' })).to.eql([
                    { block : 'popup' },
                    { block : 'popup', mod : { name : 'autoclosable' } },
                    { block : 'popup', mod : { name : 'autoclosable', val : 'yes' } }
                ]);
            });

            it('should extract block with modifier and several values', () => {
                expect(p('b:popup m:theme=normal|action', { block : 'popup', elem : 'tail' })).to.eql([
                    { block : 'popup' },
                    { block : 'popup', mod : { name : 'theme' } },
                    { block : 'popup', mod : { name : 'theme', val : 'normal' } },
                    { block : 'popup', mod : { name : 'theme', val : 'action' } }
                ]);
            });

            it('should extract block with several modifiers', () => {
                expect(p('b:popup m:theme m:autoclosable', { block : 'popup', elem : 'tail' })).to.eql([
                    { block : 'popup' },
                    { block : 'popup', mod : { name : 'theme' } },
                    { block : 'popup', mod : { name : 'autoclosable' } }
                ]);
            });

            it('should extract block with several modifiers and several values', () => {
                expect(
                    p( 'b:popup m:theme=normal|action m:autoclosable=yes', { block : 'popup', elem : 'tail' })
                ).to.eql([
                    { block : 'popup' },
                    { block : 'popup', mod : { name : 'theme' } },
                    { block : 'popup', mod : { name : 'theme', val : 'normal' } },
                    { block : 'popup', mod : { name : 'theme', val : 'action' } },
                    { block : 'popup', mod : { name : 'autoclosable' } },
                    { block : 'popup', mod : { name : 'autoclosable', val : 'yes' } }
                ]);
            });
        });
    });
});

describe('elem', () => {
    it('should extract elem', () => {
        expect(p('b:button2 e:text')).to.eql([
            { block : 'button2', elem : 'text' }
        ]);
    });

    it('should extract elem with simple modifier', () => {
        expect(p('b:button2 e:text m:pseudo')).to.eql([
            { block : 'button2', elem : 'text' },
            { block : 'button2', elem : 'text', mod : { name : 'pseudo' } }
        ]);
    });

    it('should extract elem with modifier', () => {
        expect(p('b:button2 e:text m:pseudo=yes')).to.eql([
            { block : 'button2', elem : 'text' },
            { block : 'button2', elem : 'text', mod : { name : 'pseudo' } },
            { block : 'button2', elem : 'text', mod : { name : 'pseudo', val : 'yes' } }
        ]);
    });

    it('should extract elem with modifier and several values', () => {
        expect(p('b:button2 e:text m:theme=normal|action')).to.eql([
            { block : 'button2', elem : 'text' },
            { block : 'button2', elem : 'text', mod : { name : 'theme' } },
            { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'normal' } },
            { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'action' } }
        ]);
    });

    it('should extract elem with several modifiers', () => {
        expect(p('b:popup e:tail m:theme m:autoclosable')).to.eql([
            { block : 'popup', elem : 'tail' },
            { block : 'popup', elem : 'tail', mod : { name : 'theme' } },
            { block : 'popup', elem : 'tail', mod : { name : 'autoclosable' } }
        ]);
    });

    it('should extract elem with several modifiers and several values', () => {
        expect(p('b:popup e:tail m:theme=normal|action m:autoclosable=yes')).to.eql([
            { block : 'popup', elem : 'tail' },
            { block : 'popup', elem : 'tail', mod : { name : 'theme' } },
            { block : 'popup', elem : 'tail', mod : { name : 'theme', val : 'normal' } },
            { block : 'popup', elem : 'tail', mod : { name : 'theme', val : 'action' } },
            { block : 'popup', elem : 'tail', mod : { name : 'autoclosable' } },
            { block : 'popup', elem : 'tail', mod : { name : 'autoclosable', val : 'yes' } }
        ]);
    });

    describe('ctx', () => {
        describe('extract element from current block', () => {
            describe('context is block', () => {
                it('should extract elem', () => {
                    expect(p('e:text', { block : 'button2' })).to.eql([
                        { block : 'button2', elem : 'text' }
                    ]);
                });

                it('should extract elem with simple modifier', () => {
                    expect(p('e:text m:pseudo', { block : 'button2' })).to.eql([
                        { block : 'button2', elem : 'text' },
                        { block : 'button2', elem : 'text', mod : { name : 'pseudo' } }
                    ]);
                });

                it('should extract elem with modifier', () => {
                    expect(p('e:text m:pseudo=yes', { block : 'button2' })).to.eql([
                        { block : 'button2', elem : 'text' },
                        { block : 'button2', elem : 'text', mod : { name : 'pseudo' } },
                        { block : 'button2', elem : 'text', mod : { name : 'pseudo', val : 'yes' } }
                    ]);
                });

                it('should extract elem with modifier and several values', () => {
                    expect(p('e:text m:theme=normal|action', { block : 'button2' })).to.eql([
                        { block : 'button2', elem : 'text' },
                        { block : 'button2', elem : 'text', mod : { name : 'theme' } },
                        { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'normal' } },
                        { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'action' } }
                    ]);
                });

                it('should extract elem with several modifiers', () => {
                    expect(p('e:text m:theme m:autoclosable', { block : 'button2' })).to.eql([
                        { block : 'button2', elem : 'text' },
                        { block : 'button2', elem : 'text', mod : { name : 'theme' } },
                        { block : 'button2', elem : 'text', mod : { name : 'autoclosable' } }
                    ]);
                });

                it('should extract elem with several modifiers and several values', () => {
                    expect(
                        p('e:text m:theme=normal|action m:autoclosable=yes', { block : 'button2' })
                    ).to.eql([
                        { block : 'button2', elem : 'text' },
                        { block : 'button2', elem : 'text', mod : { name : 'theme' } },
                        { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'normal' } },
                        { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'action' } },
                        { block : 'button2', elem : 'text', mod : { name : 'autoclosable' } },
                        { block : 'button2', elem : 'text', mod : { name : 'autoclosable', val : 'yes' } }
                    ]);
                });
            });

            describe('context is elem', () => {
                it('should extract elem with simple modifier', () => {
                    expect(p('m:pseudo', { block : 'button2', elem : 'text' })).to.eql([
                        { block : 'button2', elem : 'text', mod : { name : 'pseudo' } }
                    ]);
                });

                it('should extract elem with modifier', () => {
                    expect(p('m:pseudo=yes', { block : 'button2', elem : 'text' })).to.eql([
                        { block : 'button2', elem : 'text', mod : { name : 'pseudo' } },
                        { block : 'button2', elem : 'text', mod : { name : 'pseudo', val : 'yes' } }
                    ]);
                });

                it('should extract elem with modifier and several values', () => {
                    expect(p('m:theme=normal|action', { block : 'button2', elem : 'text' })).to.eql([
                        { block : 'button2', elem : 'text', mod : { name : 'theme' } },
                        { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'normal' } },
                        { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'action' } }
                    ]);
                });

                it('should extract elem with several modifiers', () => {
                    expect(p('m:theme m:autoclosable', { block : 'popup', elem : 'tail' })).to.eql([
                        { block : 'popup', elem : 'tail', mod : { name : 'theme' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'autoclosable' } }
                    ]);
                });

                it('should extract elem with several modifiers and several values', () => {
                    expect(
                        p('m:theme=normal|action m:autoclosable=yes', { block : 'popup', elem : 'tail' })
                    ).to.eql([
                        { block : 'popup', elem : 'tail', mod : { name : 'theme' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'theme', val : 'normal' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'theme', val : 'action' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'autoclosable' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'autoclosable', val : 'yes' } }
                    ]);
                });
            });

            describe('context is another elem', () => {
                it('should extract elem', () => {
                    expect(p('e:text', { block : 'button2', elem : 'control' })).to.eql([
                        { block : 'button2', elem : 'text' }
                    ]);
                });

                it('should extract elem with simple modifier', () => {
                    expect(p('e:text m:pseudo', { block : 'button2', elem : 'control' })).to.eql([
                        { block : 'button2', elem : 'text' },
                        { block : 'button2', elem : 'text', mod : { name : 'pseudo' } }
                    ]);
                });

                it('should extract elem with modifier', () => {
                    expect(p('e:text m:pseudo=yes', { block : 'button2', elem : 'control' })).to.eql([
                        { block : 'button2', elem : 'text' },
                        { block : 'button2', elem : 'text', mod : { name : 'pseudo' } },
                        { block : 'button2', elem : 'text', mod : { name : 'pseudo', val : 'yes' } }
                    ]);
                });

                it('should extract elem with modifier and several values', () => {
                    expect(p('e:text m:theme=normal|action', { block : 'button2', elem : 'control' })).to.eql([
                        { block : 'button2', elem : 'text' },
                        { block : 'button2', elem : 'text', mod : { name : 'theme' } },
                        { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'normal' } },
                        { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'action' } }
                    ]);
                });

                it('should extract elem with several modifiers', () => {
                    expect(p('e:tail m:theme m:autoclosable', { block : 'popup', elem : 'control' })).to.eql([
                        { block : 'popup', elem : 'tail' },
                        { block : 'popup', elem : 'tail', mod : { name : 'theme' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'autoclosable' } }
                    ]);
                });

                it('should extract elem with several modifiers and several values', () => {
                    expect(
                        p('e:tail m:theme=normal|action m:autoclosable=yes', { block : 'popup', elem : 'control' })
                    ).to.eql([
                        { block : 'popup', elem : 'tail' },
                        { block : 'popup', elem : 'tail', mod : { name : 'theme' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'theme', val : 'normal' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'theme', val : 'action' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'autoclosable' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'autoclosable', val : 'yes' } }
                    ]);
                });
            });

            describe('context is current elem', () => {
                it('should extract elem with simple modifier', () => {
                    expect(p('e:text m:pseudo', { block : 'button2', elem : 'text' })).to.eql([
                        { block : 'button2', elem : 'text', mod : { name : 'pseudo' } }
                    ]);
                });

                it('should extract elem with modifier', () => {
                    expect(p('e:text m:pseudo=yes', { block : 'button2', elem : 'text' })).to.eql([
                        { block : 'button2', elem : 'text', mod : { name : 'pseudo' } },
                        { block : 'button2', elem : 'text', mod : { name : 'pseudo', val : 'yes' } }
                    ]);
                });

                it('should extract elem with modifier and several values', () => {
                    expect(p('e:text m:theme=normal|action', { block : 'button2', elem : 'text' })).to.eql([
                        { block : 'button2', elem : 'text', mod : { name : 'theme' } },
                        { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'normal' } },
                        { block : 'button2', elem : 'text', mod : { name : 'theme', val : 'action' } }
                    ]);
                });

                it('should extract elem with several modifiers', () => {
                    expect(p('e:tail m:theme m:autoclosable', { block : 'popup', elem : 'tail' })).to.eql([
                        { block : 'popup', elem : 'tail', mod : { name : 'theme' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'autoclosable' } }
                    ]);
                });

                it('should extract elem with several modifiers and several values', () => {
                    expect(
                        p('e:tail m:theme=normal|action m:autoclosable=yes', { block : 'popup', elem : 'tail' })
                    ).to.eql([
                        { block : 'popup', elem : 'tail', mod : { name : 'theme' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'theme', val : 'normal' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'theme', val : 'action' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'autoclosable' } },
                        { block : 'popup', elem : 'tail', mod : { name : 'autoclosable', val : 'yes' } }
                    ]);
                });
            });
        });

        describe('extract element from another block', () => {
            describe('context is block', () => {
                it('should extract elem', () => {
                    expect(p('b:button1 e:text', { block : 'button2' })).to.eql([
                        { block : 'button1', elem : 'text' }
                    ]);
                });

                it('should extract elem with simple modifier', () => {
                    expect(p('b:button1 e:text m:pseudo', { block : 'button2' })).to.eql([
                        { block : 'button1', elem : 'text' },
                        { block : 'button1', elem : 'text', mod : { name : 'pseudo' } }
                    ]);
                });

                it('should extract elem with modifier', () => {
                    expect(p('b:button1 e:text m:pseudo=yes', { block : 'button2' })).to.eql([
                        { block : 'button1', elem : 'text' },
                        { block : 'button1', elem : 'text', mod : { name : 'pseudo' } },
                        { block : 'button1', elem : 'text', mod : { name : 'pseudo', val : 'yes' } }
                    ]);
                });

                it('should extract elem with modifier and several values', () => {
                    expect(p('b:button1 e:text m:theme=normal|action', { block : 'button2' })).to.eql([
                        { block : 'button1', elem : 'text' },
                        { block : 'button1', elem : 'text', mod : { name : 'theme' } },
                        { block : 'button1', elem : 'text', mod : { name : 'theme', val : 'normal' } },
                        { block : 'button1', elem : 'text', mod : { name : 'theme', val : 'action' } }
                    ]);
                });

                it('should extract elem with several modifiers', () => {
                    expect(p('b:button1 e:text m:theme m:autoclosable', { block : 'button2' })).to.eql([
                        { block : 'button1', elem : 'text' },
                        { block : 'button1', elem : 'text', mod : { name : 'theme' } },
                        { block : 'button1', elem : 'text', mod : { name : 'autoclosable' } }
                    ]);
                });

                it('should extract elem with several modifiers and several values', () => {
                    expect(
                        p('b:button1 e:text m:theme=normal|action m:autoclosable=yes', { block : 'button2' })
                    ).to.eql([
                        { block : 'button1', elem : 'text' },
                        { block : 'button1', elem : 'text', mod : { name : 'theme' } },
                        { block : 'button1', elem : 'text', mod : { name : 'theme', val : 'normal' } },
                        { block : 'button1', elem : 'text', mod : { name : 'theme', val : 'action' } },
                        { block : 'button1', elem : 'text', mod : { name : 'autoclosable' } },
                        { block : 'button1', elem : 'text', mod : { name : 'autoclosable', val : 'yes' } }
                    ]);
                });
            });

            describe('context is elem', () => {

                it('should extract elem', () => {
                    expect(p('b:button1 e:text', { block : 'button2', elem : 'control' })).to.eql([
                        { block : 'button1', elem : 'text' }
                    ]);
                });

                it('should extract elem with simple modifier', () => {
                    expect(p('b:button1 e:control m:pseudo', { block : 'button2', elem : 'text' })).to.eql([
                        { block : 'button1', elem : 'control' },
                        { block : 'button1', elem : 'control', mod : { name : 'pseudo' } }
                    ]);
                });

                it('should extract elem with modifier', () => {
                    expect(p('b:button1 e:control m:pseudo=yes', { block : 'button2', elem : 'text' })).to.eql([
                        { block : 'button1', elem : 'control' },
                        { block : 'button1', elem : 'control', mod : { name : 'pseudo' } },
                        { block : 'button1', elem : 'control', mod : { name : 'pseudo', val : 'yes' } }
                    ]);
                });

                it('should extract elem with modifier and several values', () => {
                    expect(
                        p('b:button1 e:control m:theme=normal|action', { block : 'button2', elem : 'text' })
                    ).to.eql([
                        { block : 'button1', elem : 'control' },
                        { block : 'button1', elem : 'control', mod : { name : 'theme' } },
                        { block : 'button1', elem : 'control', mod : { name : 'theme', val : 'normal' } },
                        { block : 'button1', elem : 'control', mod : { name : 'theme', val : 'action' } }
                    ]);
                });

                it('should extract elem with several modifiers', () => {
                    expect(p('b:button1 e:control m:theme m:autoclosable', { block : 'popup', elem : 'tail' })).to.eql([
                        { block : 'button1', elem : 'control' },
                        { block : 'button1', elem : 'control', mod : { name : 'theme' } },
                        { block : 'button1', elem : 'control', mod : { name : 'autoclosable' } }
                    ]);
                });

                it('should extract elem with several modifiers and several values', () => {
                    expect(
                        p(
                            'b:button1 e:control m:theme=normal|action m:autoclosable=yes',
                            { block : 'popup', elem : 'tail' }
                        )
                    ).to.eql([
                        { block : 'button1', elem : 'control' },
                        { block : 'button1', elem : 'control', mod : { name : 'theme' } },
                        { block : 'button1', elem : 'control', mod : { name : 'theme', val : 'normal' } },
                        { block : 'button1', elem : 'control', mod : { name : 'theme', val : 'action' } },
                        { block : 'button1', elem : 'control', mod : { name : 'autoclosable' } },
                        { block : 'button1', elem : 'control', mod : { name : 'autoclosable', val : 'yes' } }
                    ]);
                });
            });

            describe('context is elem with same name', () => {
                it('should extract elem', () => {
                    expect(p('b:button1 e:text', { block : 'button2', elem : 'text' })).to.eql([
                        { block : 'button1', elem : 'text' }
                    ]);
                });

                it('should extract elem with simple modifier', () => {
                    expect(p('b:button1 e:control m:pseudo', { block : 'button2', elem : 'control' })).to.eql([
                        { block : 'button1', elem : 'control' },
                        { block : 'button1', elem : 'control', mod : { name : 'pseudo' } }
                    ]);
                });

                it('should extract elem with modifier', () => {
                    expect(p('b:button1 e:control m:pseudo=yes', { block : 'button2', elem : 'control' })).to.eql([
                        { block : 'button1', elem : 'control' },
                        { block : 'button1', elem : 'control', mod : { name : 'pseudo' } },
                        { block : 'button1', elem : 'control', mod : { name : 'pseudo', val : 'yes' } }
                    ]);
                });

                it('should extract elem with modifier and several values', () => {
                    expect(
                        p('b:button1 e:control m:theme=normal|action', { block : 'button2', elem : 'control' })
                    ).to.eql([
                        { block : 'button1', elem : 'control' },
                        { block : 'button1', elem : 'control', mod : { name : 'theme' } },
                        { block : 'button1', elem : 'control', mod : { name : 'theme', val : 'normal' } },
                        { block : 'button1', elem : 'control', mod : { name : 'theme', val : 'action' } }
                    ]);
                });

                it('should extract elem with several modifiers', () => {
                    expect(
                        p('b:button1 e:control m:theme m:autoclosable', { block : 'popup', elem : 'control' })
                    ).to.eql([
                        { block : 'button1', elem : 'control' },
                        { block : 'button1', elem : 'control', mod : { name : 'theme' } },
                        { block : 'button1', elem : 'control', mod : { name : 'autoclosable' } }
                    ]);
                });

                it('should extract elem with several modifiers and several values', () => {
                    expect(
                        p(
                            'b:button1 e:control m:theme=normal|action m:autoclosable=yes',
                            { block : 'popup', elem : 'control' }
                        )
                    ).to.eql([
                        { block : 'button1', elem : 'control' },
                        { block : 'button1', elem : 'control', mod : { name : 'theme' } },
                        { block : 'button1', elem : 'control', mod : { name : 'theme', val : 'normal' } },
                        { block : 'button1', elem : 'control', mod : { name : 'theme', val : 'action' } },
                        { block : 'button1', elem : 'control', mod : { name : 'autoclosable' } },
                        { block : 'button1', elem : 'control', mod : { name : 'autoclosable', val : 'yes' } }
                    ]);
                });
            });

        });
    });
});

describe('tech', () => {
    it('should extract tech', () => {
        expect(p('b:button2 t:css')).to.eql([
            { block : 'button2', tech : 'css' }
        ]);
    });

    it('should extract tech for each entity', () => {
        expect(p('b:popup m:autoclosable=yes t:js')).to.eql([
            { block : 'popup', tech : 'js' },
            { block : 'popup', mod : { name : 'autoclosable' }, tech : 'js' },
            { block : 'popup', mod : { name : 'autoclosable', val : 'yes' }, tech : 'js' }
        ]);
    });

    describe('ctx', () => {
        it('should extract tech for block in ctx', () => {
            expect(p('t:css', { block : 'button2' })).to.eql([
                { block : 'button2', tech : 'css' }
            ]);
        });

        it('should extract tech for elem in ctx', () => {
            expect(p('t:css', { block : 'button2', elem : 'text' })).to.eql([
                { block : 'button2', elem : 'text', tech : 'css' }
            ]);
        });
    });
});
