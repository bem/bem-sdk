'use strict';

const expect = require('chai').expect;
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

const scheme = require('..');

const n = require('path').normalize;

describe('default', function() {

    it('should return path + tech', function() {
        expect(scheme().path(
            BemCell.create({block: 'a', tech: 'js'})
        )).eql(n('a/a.js'));
    });

    it('should return nested scheme by default', function() {
        expect(scheme().path(
            BemCell.create({block: 'a', elem: 'e1', tech: 'js'})
        )).eql(n('a/__e1/a__e1.js'));
    });

    it('should return error', function() {
        var s = scheme;
        expect(s.bind(s, 'scheme-not-found')).to.throw(/Scheme not found/);
    });

    describe('lib/schemes/nested', function() {
        it('should return path for a block', function() {
            expect(scheme('nested').path(
                BemCell.create({block: 'a', tech: 'js'})
            )).eql(n('a/a.js'));
        });

        it('should throw when you use not BemCell', function() {
            expect(
                () => scheme('nested').path(BemEntityName.create({block: 'a'}))
            ).to.throw(/@bem\//);
        });

        it('should return path for a block with modifier', function() {
            expect(scheme('nested').path(
                BemCell.create({ block: 'a', modName: 'mn', modVal: 'mv', tech: 'js'})
            )).eql(n('a/_mn/a_mn_mv.js'));
        });

        it('should return path for a block with boolean modifier', function() {
            expect(scheme('nested').path(
                BemCell.create({block: 'a', mod: {name: 'mn', val: true }, tech: 'js'})
            )).eql(n('a/_mn/a_mn.js'));
        });

        it('should return path for a block with modifier without value', function() {
            expect(scheme('nested').path(
                BemCell.create({block: 'a', mod: {name: 'mn'}, tech: 'js'})
            )).eql(n('a/_mn/a_mn.js'));
        });

        it('should return path for elem', function() {
            expect(scheme('nested').path(
                BemCell.create({block: 'a', elem: 'e1', tech: 'js'})
            )).eql(n('a/__e1/a__e1.js'));
        });

        it('should return path for modName elem', function() {
            expect(scheme('nested').path(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'},
                    tech: 'js'
                })
            )).eql(n('a/__e1/_mn/a__e1_mn_mv.js'));
        });

        it('should support optional tech for BemCell', function() {
            expect(scheme('nested').path(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'}
                })
            )).eql(n('a/__e1/_mn/a__e1_mn_mv'));
        });

        it('should support layer for BemCell', function() {
            expect(scheme('nested').path(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'},
                    tech: 'js',
                    layer: 'common'
                })
            )).eql(n('common.blocks/a/__e1/_mn/a__e1_mn_mv.js'));
        });

        describe('options', function() {
            it('should support optional naming style', function() {
                expect(scheme('nested').path(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    }),
                    {naming: {delims: {elem: '%%%', mod: '###'}}}
                )).eql(n('a/%%%e1/###mn/a%%%e1###mn###mv.js'));
            });

            it('should support optional naming style with different delim for elem/mod dirs', function() {
                expect(scheme('nested').path(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    }),
                    {
                        naming: {delims: {elem: '%%%', mod: '###'}},
                        elemDirDelim: '*',
                        modDirDelim: '^'
                    }
                )).eql(n('a/*e1/^mn/a%%%e1###mn###mv.js'));
            });

            it('should allow elemDirDelim and modDirDelim as empty string', function() {
                expect(scheme('nested').path(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    }),
                    {
                        elemDirDelim: '',
                        modDirDelim: ''
                    }
                )).eql(n('a/e1/mn/a__e1_mn_mv.js'));
            });

            it('should allow options as String', function() {
                expect(scheme('nested').path(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    }),
                    'origin'
                )).eql(n('a/__e1/_mn/a__e1_mn_mv.js'), 'origin');

                expect(scheme('nested').path(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    }),
                    'two-dashes'
                )).eql(n('a/__e1/--mn/a__e1--mn_mv.js'), 'two-dashes');

                expect(scheme('nested').path(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    }),
                    'react'
                )).eql(n('a/e1/_mn/a-e1_mn_mv.js'), 'react');
            });
        });
    });

    describe('lib/schemes/flat', function() {
        it('should return path for a block', function() {
            expect(scheme('flat').path(
                BemCell.create({
                    block: 'a',
                    tech: 'js'
                })
            )).eql(n('a.js'));
        });

        it('should throw when you use not BemCell', function() {
            expect(
                () => scheme('flat').path(BemEntityName.create({block: 'a'}))
            ).to.throw(/@bem\//);
        });

        it('should return path for a block with modifier', function() {
            expect(scheme('flat').path(
                BemCell.create({
                    block: 'a',
                    mod: {name: 'mn', val: 'mv'},
                    tech: 'js'
                })
            )).eql(n('a_mn_mv.js'));
        });

        it('should return path for elem', function() {
            expect(scheme('flat').path(
                BemCell.create({block: 'a', elem: 'e1', tech: 'js'})
            )).eql(n('a__e1.js'));
        });

        it('should return path for modName elem', function() {
            expect(scheme('flat').path(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'},
                    tech: 'js'
                })
            )).eql(n('a__e1_mn_mv.js'));
        });

        it('should support optional naming style', function() {
            expect(scheme('flat').path(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'},
                    tech: 'js'
                }),
                {naming: {delims: {elem: '%%%', mod: '###'}}}
            )).eql(n('a%%%e1###mn###mv.js'));
        });

        it('should support optional tech for BemCell', function() {
            expect(scheme('flat').path(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'}
                })
            )).eql(n('a__e1_mn_mv'));
        });

        it('should support layer for BemCell', function() {
            expect(scheme('flat').path(
                BemCell.create({
                    block: 'a',
                    elem: 'e1',
                    mod: {name: 'mn', val: 'mv'},
                    tech: 'js',
                    layer: 'common'
                })
            )).eql(n('common.blocks/a__e1_mn_mv.js'));
        });

        describe('options', function() {
            it('should support optional naming style', function() {
                expect(scheme('flat').path(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    }),
                    {naming: {delims:{elem: '%%%', mod: '###'}}}
                )).eql(n('a%%%e1###mn###mv.js'));
            });

            it('should allow options as String', function() {
                expect(scheme('flat').path(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    }),
                    'origin'
                )).eql(n('a__e1_mn_mv.js'), 'origin');

                expect(scheme('flat').path(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    }),
                    'two-dashes'
                )).eql(n('a__e1--mn_mv.js'), 'two-dashes');

                expect(scheme('flat').path(
                    BemCell.create({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'},
                        tech: 'js'
                    }), 'react'
                )).eql(n('a-e1_mn_mv.js'), 'react');
            });
        });
    });
});
