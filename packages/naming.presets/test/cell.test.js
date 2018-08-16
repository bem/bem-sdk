'use strict';

const expect = require('chai').expect;

const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

const createStringify = require('@bem/sdk.naming.cell.stringify');

const presets = require('../lib');

const createPreset = (name, fsConv, conv) => {
    const res = Object.assign({}, presets[name], conv);
    res.fs = Object.assign({}, res.fs, fsConv);
    return res;
};

const n = v => v;

describe('default', () => {
    const originFlat = createStringify(createPreset('origin', { scheme: 'flat' }));
    const originNested = createStringify(presets.origin);
    const reactFlat = createStringify(createPreset('react', { scheme: 'flat' }));
    const reactNested = createStringify(presets.react);
    const twoFlat = createStringify(createPreset('twoDashes', { scheme: 'flat' }));
    const twoNested = createStringify(presets['twoDashes']);

    it('should return path + tech', () => {
        expect(originNested(
            BemCell.create({block: 'a', tech: 'js'})
        )).eql(n('common.blocks/a/a.js'));
    });

    it('should return nested scheme by default', () => {
        expect(originNested(
            BemCell.create({block: 'a', elem: 'e1', tech: 'js'})
        )).eql(n('common.blocks/a/__e1/a__e1.js'));
    });

    it.skip('should throw an error', () => {
        expect(createStringify({ scheme: 'scheme-not-found' })).to.throw(/Scheme not found/);
    });

    describe('lib/schemes/nested', () => {
        it('should return path for a block', () => {
            expect(originNested(
                BemCell.create({block: 'a', tech: 'js'})
            )).eql(n('common.blocks/a/a.js'));
        });

        it('should throw when you use not BemCell', () => {
            expect(
                () => originNested(BemEntityName.create({block: 'a'}))
            ).to.throw(/@bem\//);
        });

        it('should return path for a block with modifier', () => {
            expect(originNested(
                BemCell.create({ block: 'a', modName: 'mn', modVal: 'mv', tech: 'js'})
            )).eql(n('common.blocks/a/_mn/a_mn_mv.js'));
        });

        it('should return path for a block with boolean modifier', () => {
            expect(originNested(
                BemCell.create({block: 'a', mod: {name: 'mn', val: true }, tech: 'js'})
            )).eql(n('common.blocks/a/_mn/a_mn.js'));
        });

        it('should return path for a block with modifier without value', () => {
            expect(originNested(
                BemCell.create({block: 'a', mod: {name: 'mn'}, tech: 'js'})
            )).eql(n('common.blocks/a/_mn/a_mn.js'));
        });

        it('should return path for elem', () => {
            expect(originNested(
                BemCell.create({block: 'a', elem: 'e1', tech: 'js'})
            )).eql(n('common.blocks/a/__e1/a__e1.js'));
        });

        it('should return path for modName elem', () => {
            expect(originNested(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'},
                    tech: 'js'
                })
            )).eql(n('common.blocks/a/__e1/_mn/a__e1_mn_mv.js'));
        });

        it('should not support optional tech for BemCell', () => {
            expect(() => originNested(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'}
                })
            )).to.throw(/tech field required/);
        });

        it('should support layer for BemCell', () => {
            expect(originNested(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'},
                    tech: 'js',
                    layer: 'desktop'
                })
            )).eql(n('desktop.blocks/a/__e1/_mn/a__e1_mn_mv.js'));
        });

        describe('options', () => {
            it('should support optional naming style', () => {
                expect(createStringify(createPreset('origin', {}, {delims: {elem: '%%%', mod: '###'}}))(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    })
                )).eql(n('common.blocks/a/%%%e1/###mn/a%%%e1###mn###mv.js'));
            });

            it('should support optional naming style with different delim for elem/mod dirs', () => {
                expect(createStringify(createPreset('origin',
                        {delims: {elem: '*', mod: '^'}},
                        {delims: {elem: '%%%', mod: '###'}}))(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    })
                )).eql(n('common.blocks/a/*e1/^mn/a%%%e1###mn###mv.js'));
            });

            it('should allow fs.delims.{elem,mod} to be empty strings', () => {
                expect(createStringify(createPreset('origin', {delims: {elem: '', mod: ''}}))(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    })
                )).eql(n('common.blocks/a/e1/mn/a__e1_mn_mv.js'));
            });

            it('should allow options as String', () => {
                expect(originNested(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    })
                )).eql(n('common.blocks/a/__e1/_mn/a__e1_mn_mv.js'), 'origin');

                expect(twoNested(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    })
                )).eql(n('common.blocks/a/__e1/--mn/a__e1--mn_mv.js'), 'two-dashes');

                expect(reactNested(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        layer: 'ios',
                        tech: 'js'
                    })
                )).eql(n('a/e1/_mn/a-e1_mn_mv@ios.js'), 'react');
            });
        });
    });

    describe('lib/schemes/flat', () => {
        it('should return path for a block', () => {
            expect(originFlat(
                BemCell.create({
                    block: 'a',
                    tech: 'js'
                })
            )).eql(n('common.blocks/a.js'));
        });

        it('should throw when you use not BemCell', () => {
            expect(
                () => originFlat(BemEntityName.create({block: 'a'}))
            ).to.throw(/@bem\//);
        });

        it('should return path for a block with modifier', () => {
            expect(originFlat(
                BemCell.create({
                    block: 'a',
                    mod: {name: 'mn', val: 'mv'},
                    tech: 'js'
                })
            )).eql(n('common.blocks/a_mn_mv.js'));
        });

        it('should return path for elem', () => {
            expect(originFlat(
                BemCell.create({block: 'a', elem: 'e1', tech: 'js'})
            )).eql(n('common.blocks/a__e1.js'));
        });

        it('should return path for mod.name elem', () => {
            expect(originFlat(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'},
                    tech: 'js'
                })
            )).eql(n('common.blocks/a__e1_mn_mv.js'));
        });

        it('should support optional naming style', () => {
            expect(createStringify(createPreset('origin',
                    {scheme: 'flat'},
                    {delims: {elem: '%%%', mod: '###'}}))(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'},
                    tech: 'js'
                })
            )).eql(n('common.blocks/a%%%e1###mn###mv.js'));
        });

        it('should not support optional tech for BemCell', () => {
            expect(() => originFlat(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'}
                })
            )).to.throw(/tech field required/);
        });

        it('should support layer for BemCell', () => {
            expect(originFlat(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'},
                    tech: 'js',
                    layer: 'common'
                })
            )).eql(n('common.blocks/a__e1_mn_mv.js'));
        });

        describe('options', () => {
            it('should support optional naming style', () => {
                const stringify = createStringify(createPreset('origin',
                    {scheme: 'flat'},
                    {delims: {elem: '%%%', mod: '###'}}));
                expect(stringify(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    })
                )).eql(n('common.blocks/a%%%e1###mn###mv.js'));
            });

            it('should allow options as String', () => {
                expect(originFlat(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    })
                )).eql(n('common.blocks/a__e1_mn_mv.js'), 'origin');

                expect(twoFlat(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    })
                )).eql(n('common.blocks/a__e1--mn_mv.js'), 'two-dashes');

                expect(reactFlat(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        layer: 'ios',
                        tech: 'js'
                    })
                )).eql(n('a-e1_mn_mv@ios.js'), 'react');
            });
        });
    });
});
