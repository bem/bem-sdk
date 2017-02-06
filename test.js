var expect = require('chai').expect,
    BemCell = require('@bem/cell'),
    parse = require('.').parse;

describe('', () => {

    it('should return array', () => {
        expect(parse('b:button')).to.have.lengthOf(1);
    });

    function _assertBlock(entity, blockName) {
        var cell = BemCell.create(entity);

        expect(cell.entity.block).to.eql(blockName, 'blockName');

        return cell;
    }

    describe('block', () => {

        function assertBlock(entity, blockName) {
            var cell = _assertBlock(entity, blockName);

            expect(cell.entity.type).to.eql('block', 'type of entity');
        }

        function assertBlockMod(entity, blockName, modName, modVal) {
            var cell = _assertBlock(entity, blockName);

            expect(cell.entity.type).to.eql('blockMod', 'type of entity');

            expect(cell.entity.modName).to.eql(modName, 'modName');
            expect(cell.entity.modVal).to.eql(modVal, 'modVal');
        }

        it('should extract block', () => {
            var entities = parse('b:button2');
            expect(entities).to.have.lengthOf(1);

            assertBlock(entities[0], 'button2');
        });

        it('should extract block with simple modifier', () => {
            var entities = parse('b:popup m:autoclosable');
            expect(entities).to.have.lengthOf(2);

            assertBlock(entities[0], 'popup');
            assertBlockMod(entities[1], 'popup', 'autoclosable', true);
        });

        it('should extract block with modifier', () => {
            var entities = parse('b:popup m:autoclosable=yes');
            expect(entities).to.have.lengthOf(3);

            assertBlock(entities[0], 'popup');
            assertBlockMod(entities[1], 'popup', 'autoclosable', true);
            assertBlockMod(entities[2], 'popup', 'autoclosable', 'yes');
        });

        it('should extract block with modifier and several values', () => {
            var entities = parse('b:popup m:theme=normal|action');
            expect(entities).to.have.lengthOf(4);

            assertBlock(entities[0], 'popup');
            assertBlockMod(entities[1], 'popup', 'theme', true);
            assertBlockMod(entities[2], 'popup', 'theme', 'normal');
            assertBlockMod(entities[3], 'popup', 'theme', 'action');
        });

        it('should extract block with several modifiers', () => {
            var entities = parse('b:popup m:theme m:autoclosable');
            expect(entities).to.have.lengthOf(3);

            assertBlock(entities[0], 'popup');
            assertBlockMod(entities[1], 'popup', 'theme', true);
            assertBlockMod(entities[2], 'popup', 'autoclosable', true);
        });

        it('should extract block with several modifiers and several values', () => {
            var entities = parse('b:popup m:theme=normal|action m:autoclosable=yes');
            expect(entities).to.have.lengthOf(6);

            assertBlock(entities[0], 'popup');
            assertBlockMod(entities[1], 'popup', 'theme', true);
            assertBlockMod(entities[2], 'popup', 'theme', 'normal');
            assertBlockMod(entities[3], 'popup', 'theme', 'action');
            assertBlockMod(entities[4], 'popup', 'autoclosable', true);
            assertBlockMod(entities[5], 'popup', 'autoclosable', 'yes');
        });

        describe('ctx', () => {

            describe('context is block', () => {

                it('should extract blockMod', () => {
                    var entities = parse('m:autoclosable', { block : 'popup' });
                    expect(entities).to.have.lengthOf(1);

                    assertBlockMod(entities[0], 'popup', 'autoclosable', true);
                });

                it('should extract block with modifier', () => {
                    var entities = parse('m:autoclosable=yes', { block : 'popup' });
                    expect(entities).to.have.lengthOf(2);

                    assertBlockMod(entities[0], 'popup', 'autoclosable', true);
                    assertBlockMod(entities[1], 'popup', 'autoclosable', 'yes');
                });

                it('should extract blockMod with several values', () => {
                    var entities = parse('m:theme=normal|action', { block : 'popup' });
                    expect(entities).to.have.lengthOf(3);

                    assertBlockMod(entities[0], 'popup', 'theme', true);
                    assertBlockMod(entities[1], 'popup', 'theme', 'normal');
                    assertBlockMod(entities[2], 'popup', 'theme', 'action');
                });

                it('should extract blockMod with several modifiers', () => {
                    var entities = parse('m:theme m:autoclosable', { block : 'popup' });
                    expect(entities).to.have.lengthOf(2);

                    assertBlockMod(entities[0], 'popup', 'theme', true);
                    assertBlockMod(entities[1], 'popup', 'autoclosable', true);
                });

                it('should extract blockMods with several modifiers and several values', () => {
                    var entities = parse('m:theme=normal|action m:autoclosable=yes', { block : 'popup' });
                    expect(entities).to.have.lengthOf(5);

                    assertBlockMod(entities[0], 'popup', 'theme', true);
                    assertBlockMod(entities[1], 'popup', 'theme', 'normal');
                    assertBlockMod(entities[2], 'popup', 'theme', 'action');
                    assertBlockMod(entities[3], 'popup', 'autoclosable', true);
                    assertBlockMod(entities[4], 'popup', 'autoclosable', 'yes');
                });

            });

            describe('context is elem of another block', () => {

                it('should extract block', () => {
                    var entities = parse('b:popup', { block : 'button2', elem : 'tail' });
                    expect(entities).to.have.lengthOf(1);

                    assertBlock(entities[0], 'popup');
                });

                it('should extract block with simple modifier', () => {
                    var entities = parse(
                        'b:popup m:autoclosable',
                        { block : 'button2', elem : 'tail' }
                    );

                    expect(entities).to.have.lengthOf(2);

                    assertBlock(entities[0], 'popup');
                    assertBlockMod(entities[1], 'popup', 'autoclosable', true);
                });

                it('should extract block with modifier', () => {
                    var entities = parse(
                        'b:popup m:autoclosable=yes',
                        { block : 'button2', elem : 'tail' }
                    );
                    expect(entities).to.have.lengthOf(3);

                    assertBlock(entities[0], 'popup');
                    assertBlockMod(entities[1], 'popup', 'autoclosable', true);
                    assertBlockMod(entities[2], 'popup', 'autoclosable', 'yes');
                });

                it('should extract block with modifier and several values', () => {
                    var entities = parse(
                        'b:popup m:theme=normal|action',
                        { block : 'button2', elem : 'tail' }
                    );
                    expect(entities).to.have.lengthOf(4);

                    assertBlock(entities[0], 'popup');
                    assertBlockMod(entities[1], 'popup', 'theme', true);
                    assertBlockMod(entities[2], 'popup', 'theme', 'normal');
                    assertBlockMod(entities[3], 'popup', 'theme', 'action');
                });

                it('should extract block with several modifiers', () => {
                    var entities = parse(
                        'b:popup m:theme m:autoclosable',
                        { block : 'button2', elem : 'tail' }
                    );
                    expect(entities).to.have.lengthOf(3);

                    assertBlock(entities[0], 'popup');
                    assertBlockMod(entities[1], 'popup', 'theme', true);
                    assertBlockMod(entities[2], 'popup', 'autoclosable', true);
                });

                it('should extract block with several modifiers and several values', () => {
                    var entities = parse(
                        'b:popup m:theme=normal|action m:autoclosable=yes',
                        { block : 'button2', elem : 'tail' }
                    );
                    expect(entities).to.have.lengthOf(6);

                    assertBlock(entities[0], 'popup');
                    assertBlockMod(entities[1], 'popup', 'theme', true);
                    assertBlockMod(entities[2], 'popup', 'theme', 'normal');
                    assertBlockMod(entities[3], 'popup', 'theme', 'action');
                    assertBlockMod(entities[4], 'popup', 'autoclosable', true);
                    assertBlockMod(entities[5], 'popup', 'autoclosable', 'yes');
                });

            });

            describe('context is elem of current block', () => {

                it('should extract block', () => {
                    var entities = parse('b:popup', { block : 'popup', elem : 'tail' });
                    expect(entities).to.have.lengthOf(1);

                    assertBlock(entities[0], 'popup');
                });

                it('should extract block with simple modifier', () => {
                    var entities = parse(
                        'b:popup m:autoclosable',
                        { block : 'popup', elem : 'tail' }
                    );
                    expect(entities).to.have.lengthOf(2);

                    assertBlock(entities[0], 'popup');
                    assertBlockMod(entities[1], 'popup', 'autoclosable', true);
                });

                it('should extract block with modifier', () => {
                    var entities = parse(
                        'b:popup m:autoclosable=yes',
                        { block : 'popup', elem : 'tail' }
                    );
                    expect(entities).to.have.lengthOf(3);

                    assertBlock(entities[0], 'popup');
                    assertBlockMod(entities[1], 'popup', 'autoclosable', true);
                    assertBlockMod(entities[2], 'popup', 'autoclosable', 'yes');
                });

                it('should extract block with modifier and several values', () => {
                    var entities = parse(
                        'b:popup m:theme=normal|action',
                        { block : 'popup', elem : 'tail' }
                    );
                    expect(entities).to.have.lengthOf(4);

                    assertBlock(entities[0], 'popup');
                    assertBlockMod(entities[1], 'popup', 'theme', true);
                    assertBlockMod(entities[2], 'popup', 'theme', 'normal');
                    assertBlockMod(entities[3], 'popup', 'theme', 'action');
                });

                it('should extract block with several modifiers', () => {
                    var entities = parse(
                        'b:popup m:theme m:autoclosable',
                        { block : 'popup', elem : 'tail' }
                    );
                    expect(entities).to.have.lengthOf(3);

                    assertBlock(entities[0], 'popup');
                    assertBlockMod(entities[1], 'popup', 'theme', true);
                    assertBlockMod(entities[2], 'popup', 'autoclosable', true);
                });

                it('should extract block with several modifiers and several values', () => {
                    var entities = parse(
                        'b:popup m:theme=normal|action m:autoclosable=yes',
                        { block : 'popup', elem : 'tail' }
                    );
                    expect(entities).to.have.lengthOf(6);

                    assertBlock(entities[0], 'popup');
                    assertBlockMod(entities[1], 'popup', 'theme', true);
                    assertBlockMod(entities[2], 'popup', 'theme', 'normal');
                    assertBlockMod(entities[3], 'popup', 'theme', 'action');
                    assertBlockMod(entities[4], 'popup', 'autoclosable', true);
                    assertBlockMod(entities[5], 'popup', 'autoclosable', 'yes');
                });

            });

        });

    });

    describe('elem', () => {

        function _assertElem(entity, blockName, elemName) {
            var cell = _assertBlock(entity, blockName);
            expect(cell.entity.elem).to.eql(elemName, 'elemName');
            return cell;
        }

        function assertElem(entity, blockName, elemName) {
            var cell = _assertElem(entity, blockName, elemName);

            expect(cell.entity.type).to.eql('elem', 'type');
        }

        function assertElemMod(entity, blockName, elemName, modName, modVal) {
            var cell = _assertElem(entity, blockName, elemName);

            expect(cell.entity.type).to.eql('elemMod', 'type');

            expect(cell.entity.modName).to.eql(modName, 'modName');
            expect(cell.entity.modVal).to.eql(modVal, 'modVal');
        }

        it('should extract elem', () => {
            var entities = parse('b:button2 e:text');
            expect(entities).to.have.lengthOf(1);

            assertElem(entities[0], 'button2', 'text');
        });

        it('should extract elem with simple modifier', () => {
            var entities = parse('b:button2 e:text m:pseudo');
            expect(entities).to.have.lengthOf(2);

            assertElem(entities[0], 'button2', 'text');
            assertElemMod(entities[1], 'button2', 'text', 'pseudo', true);
        });

        it('should extract elem with modifier', () => {
            var entities = parse('b:button2 e:text m:pseudo=yes');
            expect(entities).to.have.lengthOf(3);

            assertElem(entities[0], 'button2', 'text');
            assertElemMod(entities[1], 'button2', 'text', 'pseudo', true);
            assertElemMod(entities[2], 'button2', 'text', 'pseudo', 'yes');
        });

        it('should extract elem with modifier and several values', () => {
            var entities = parse('b:button2 e:text m:theme=normal|action');
            expect(entities).to.have.lengthOf(4);

            assertElem(entities[0], 'button2', 'text');
            assertElemMod(entities[1], 'button2', 'text', 'theme', true);
            assertElemMod(entities[2], 'button2', 'text', 'theme', 'normal');
            assertElemMod(entities[3], 'button2', 'text', 'theme', 'action');
        });

        it('should extract elem with several modifiers', () => {
            var entities = parse('b:popup e:tail m:theme m:autoclosable');
            expect(entities).to.have.lengthOf(3);

            assertElem(entities[0], 'popup', 'tail');
            assertElemMod(entities[1], 'popup', 'tail', 'theme', true);
            assertElemMod(entities[2], 'popup', 'tail', 'autoclosable', true);
        });

        it('should extract elem with several modifiers and several values', () => {
            var entities = parse('b:popup e:tail m:theme=normal|action m:autoclosable=yes');
            expect(entities).to.have.lengthOf(6);

            assertElem(entities[0], 'popup', 'tail');
            assertElemMod(entities[1], 'popup', 'tail', 'theme', true);
            assertElemMod(entities[2], 'popup', 'tail', 'theme', 'normal');
            assertElemMod(entities[3], 'popup', 'tail', 'theme', 'action');
            assertElemMod(entities[4], 'popup', 'tail', 'autoclosable', true);
            assertElemMod(entities[5], 'popup', 'tail', 'autoclosable', 'yes');
        });

        describe('ctx', () => {

            describe('context is block', () => {

                it('should extract elem', () => {
                    var entities = parse('e:text', { block : 'button2' });
                    expect(entities).to.have.lengthOf(1);

                    assertElem(entities[0], 'button2', 'text');
                });

                it('should extract elem with simple modifier', () => {
                    var entities = parse('e:text m:pseudo', { block : 'button2' });
                    expect(entities).to.have.lengthOf(2);

                    assertElem(entities[0], 'button2', 'text');
                    assertElemMod(entities[1], 'button2', 'text', 'pseudo', true);
                });

                it('should extract elem with modifier', () => {
                    var entities = parse('e:text m:pseudo=yes', { block : 'button2' });
                    expect(entities).to.have.lengthOf(3);

                    assertElem(entities[0], 'button2', 'text');
                    assertElemMod(entities[1], 'button2', 'text', 'pseudo', true);
                    assertElemMod(entities[2], 'button2', 'text', 'pseudo', 'yes');
                });

                it('should extract elem with modifier and several values', () => {
                    var entities = parse('e:text m:theme=normal|action', { block : 'button2' });
                    expect(entities).to.have.lengthOf(4);

                    assertElem(entities[0], 'button2', 'text');
                    assertElemMod(entities[1], 'button2', 'text', 'theme', true);
                    assertElemMod(entities[2], 'button2', 'text', 'theme', 'normal');
                    assertElemMod(entities[3], 'button2', 'text', 'theme', 'action');
                });

                it('should extract elem with several modifiers', () => {
                    var entities = parse(
                        'b:popup e:tail m:theme m:autoclosable',
                        { block : 'button2' }
                    );
                    expect(entities).to.have.lengthOf(3);

                    assertElem(entities[0], 'popup', 'tail');
                    assertElemMod(entities[1], 'popup', 'tail', 'theme', true);
                    assertElemMod(entities[2], 'popup', 'tail', 'autoclosable', true);
                });

                it('should extract elem with several modifiers and several values', () => {
                    var entities = parse(
                        'b:popup e:tail m:theme=normal|action m:autoclosable=yes',
                        { block : 'button2' }
                    );
                    expect(entities).to.have.lengthOf(6);

                    assertElem(entities[0], 'popup', 'tail');
                    assertElemMod(entities[1], 'popup', 'tail', 'theme', true);
                    assertElemMod(entities[2], 'popup', 'tail', 'theme', 'normal');
                    assertElemMod(entities[3], 'popup', 'tail', 'theme', 'action');
                    assertElemMod(entities[4], 'popup', 'tail', 'autoclosable', true);
                    assertElemMod(entities[5], 'popup', 'tail', 'autoclosable', 'yes');
                });

            });

            describe('context is elem', () => {

                it('should extract elem with simple modifier', () => {
                    var entities = parse('m:pseudo', { block : 'button2', elem : 'text' });
                    expect(entities).to.have.lengthOf(1);

                    assertElemMod(entities[0], 'button2', 'text', 'pseudo', true);
                });

                it('should extract elem with modifier', () => {
                    var entities = parse('m:pseudo=yes', { block : 'button2', elem : 'text' });
                    expect(entities).to.have.lengthOf(2);

                    assertElemMod(entities[0], 'button2', 'text', 'pseudo', true);
                    assertElemMod(entities[1], 'button2', 'text', 'pseudo', 'yes');
                });

                it('should extract elem with modifier and several values', () => {
                    var entities = parse('m:theme=normal|action', { block : 'button2', elem : 'text' });
                    expect(entities).to.have.lengthOf(3);

                    assertElemMod(entities[0], 'button2', 'text', 'theme', true);
                    assertElemMod(entities[1], 'button2', 'text', 'theme', 'normal');
                    assertElemMod(entities[2], 'button2', 'text', 'theme', 'action');
                });

                it('should extract elem with several modifiers', () => {
                    var entities = parse(
                        'm:theme m:autoclosable',
                        { block : 'popup', elem : 'tail' }
                    );
                    expect(entities).to.have.lengthOf(2);

                    assertElemMod(entities[0], 'popup', 'tail', 'theme', true);
                    assertElemMod(entities[1], 'popup', 'tail', 'autoclosable', true);
                });

                it('should extract elem with several modifiers and several values', () => {
                    var entities = parse(
                        'm:theme=normal|action m:autoclosable=yes',
                        { block : 'popup', elem : 'tail' }
                    );
                    expect(entities).to.have.lengthOf(5);

                    assertElemMod(entities[0], 'popup', 'tail', 'theme', true);
                    assertElemMod(entities[1], 'popup', 'tail', 'theme', 'normal');
                    assertElemMod(entities[2], 'popup', 'tail', 'theme', 'action');
                    assertElemMod(entities[3], 'popup', 'tail', 'autoclosable', true);
                    assertElemMod(entities[4], 'popup', 'tail', 'autoclosable', 'yes');
                });

            });

            describe('context is another elem', () => {

                it('should extract elem', () => {
                    var entities = parse('e:text', { block : 'button2', elem : 'control' });
                    expect(entities).to.have.lengthOf(1);

                    assertElem(entities[0], 'button2', 'text');
                });

                it('should extract elem with simple modifier', () => {
                    var entities = parse('e:text m:pseudo', { block : 'button2', elem : 'control' });
                    expect(entities).to.have.lengthOf(2);

                    assertElem(entities[0], 'button2', 'text');
                    assertElemMod(entities[1], 'button2', 'text', 'pseudo', true);
                });

                it('should extract elem with modifier', () => {
                    var entities = parse('e:text m:pseudo=yes', { block : 'button2', elem : 'control' });
                    expect(entities).to.have.lengthOf(3);

                    assertElem(entities[0], 'button2', 'text');
                    assertElemMod(entities[1], 'button2', 'text', 'pseudo', true);
                    assertElemMod(entities[2], 'button2', 'text', 'pseudo', 'yes');
                });

                it('should extract elem with modifier and several values', () => {
                    var entities = parse('e:text m:theme=normal|action', { block : 'button2', elem : 'control' });
                    expect(entities).to.have.lengthOf(4);

                    assertElem(entities[0], 'button2', 'text');
                    assertElemMod(entities[1], 'button2', 'text', 'theme', true);
                    assertElemMod(entities[2], 'button2', 'text', 'theme', 'normal');
                    assertElemMod(entities[3], 'button2', 'text', 'theme', 'action');
                });

                it('should extract elem with several modifiers', () => {
                    var entities = parse(
                        'e:tail m:theme m:autoclosable',
                        { block : 'popup', elem : 'control' }
                    );
                    expect(entities).to.have.lengthOf(3);

                    assertElem(entities[0], 'popup', 'tail');
                    assertElemMod(entities[1], 'popup', 'tail', 'theme', true);
                    assertElemMod(entities[2], 'popup', 'tail', 'autoclosable', true);
                });

                it('should extract elem with several modifiers and several values', () => {
                    var entities = parse(
                        'e:tail m:theme=normal|action m:autoclosable=yes',
                        { block : 'popup', elem : 'control' }
                    );
                    expect(entities).to.have.lengthOf(6);

                    assertElem(entities[0], 'popup', 'tail');
                    assertElemMod(entities[1], 'popup', 'tail', 'theme', true);
                    assertElemMod(entities[2], 'popup', 'tail', 'theme', 'normal');
                    assertElemMod(entities[3], 'popup', 'tail', 'theme', 'action');
                    assertElemMod(entities[4], 'popup', 'tail', 'autoclosable', true);
                    assertElemMod(entities[5], 'popup', 'tail', 'autoclosable', 'yes');
                });

            });

            describe('context is current elem', () => {

                it('should extract elem with simple modifier', () => {
                    var entities = parse('e:text m:pseudo', { block : 'button2', elem : 'text' });
                    expect(entities).to.have.lengthOf(1);

                    assertElemMod(entities[0], 'button2', 'text', 'pseudo', true);
                });

                it('should extract elem with modifier', () => {
                    var entities = parse('e:text m:pseudo=yes', { block : 'button2', elem : 'text' });
                    expect(entities).to.have.lengthOf(2);

                    assertElemMod(entities[0], 'button2', 'text', 'pseudo', true);
                    assertElemMod(entities[1], 'button2', 'text', 'pseudo', 'yes');
                });

                it('should extract elem with modifier and several values', () => {
                    var entities = parse('e:text m:theme=normal|action', { block : 'button2', elem : 'text' });
                    expect(entities).to.have.lengthOf(3);

                    assertElemMod(entities[0], 'button2', 'text', 'theme', true);
                    assertElemMod(entities[1], 'button2', 'text', 'theme', 'normal');
                    assertElemMod(entities[2], 'button2', 'text', 'theme', 'action');
                });

                it('should extract elem with several modifiers', () => {
                    var entities = parse(
                        'e:tail m:theme m:autoclosable',
                        { block : 'popup', elem : 'tail' }
                    );
                    expect(entities).to.have.lengthOf(2);

                    assertElemMod(entities[0], 'popup', 'tail', 'theme', true);
                    assertElemMod(entities[1], 'popup', 'tail', 'autoclosable', true);
                });

                it('should extract elem with several modifiers and several values', () => {
                    var entities = parse(
                        'e:tail m:theme=normal|action m:autoclosable=yes',
                        { block : 'popup', elem : 'tail' }
                    );
                    expect(entities).to.have.lengthOf(5);

                    assertElemMod(entities[0], 'popup', 'tail', 'theme', true);
                    assertElemMod(entities[1], 'popup', 'tail', 'theme', 'normal');
                    assertElemMod(entities[2], 'popup', 'tail', 'theme', 'action');
                    assertElemMod(entities[3], 'popup', 'tail', 'autoclosable', true);
                    assertElemMod(entities[4], 'popup', 'tail', 'autoclosable', 'yes');
                });

            });

        });

    });

    describe('tech', () => {

        it('should extract tech', () => {
            var entities = parse('b:buton2 t:css');

            var cell = BemCell.create(entities[0]);
            expect(cell.tech).to.eql('css');
        });

        it('should extract tech for each entity', () => {
            var entities = parse('b:popup m:autoclosable=yes t:js');

            expect(BemCell.create(entities[0]).tech).to.eql('js');
            expect(BemCell.create(entities[1]).tech).to.eql('js');
        });
    });

});
