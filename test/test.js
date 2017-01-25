var expect = require('chai').expect,
    BemCell = require('@bem/cell'),
    BemEntityName = require('@bem/entity-name'),
    scheme = require('..');

describe('default', function() {

    it('should return path + tech', function() {
        expect('a/a.js')
            .eql(scheme().path(
                new BemCell({
                    entity: new BemEntityName({block: 'a'}),
                    tech: 'js'
                })),
                'bemCell - api'
            );
    });

    it('should return nested scheme by default', function() {
        expect(scheme().path(
                new BemCell({
                    entity: new BemEntityName({block: 'a', elem: 'e1'}),
                    tech: 'js'
                }))
        ).eql('a/__e1/a__e1.js');
    });

    it('should return error', function() {
        var s = scheme;
        expect(s.bind(s, 'scheme-not-found')).to.throw(/Scheme not found/);
    });

    it('should support optional naming style', function() {
        expect(
            scheme('nested').path(
                new BemCell({
                    entity: new BemEntityName({
                        block: 'a',
                        elem: 'e1',
                        mod: {name: 'mn', val: 'mv'}
                    }),
                    tech: 'js'
                }),
                {naming: {elem: '%%%', mod: '###'}})
        ).eql('a/%%%e1/###mn/a%%%e1###mn###mv.js');
    });

    describe('lib/schemes/nested', function() {
        it('should return path for a block', function() {
            expect(scheme('nested').path(
                new BemCell({
                    entity: new BemEntityName({block: 'a'}),
                    tech: 'js'
                })
            )).eql('a/a.js');
        });

        it('should throw when you use not BemCell', function() {
            expect(
                scheme('nested').path.bind(null, new BemEntityName({block: 'a'}))
            ).to.throw(/@bem\/cell/);
        });

        it('should return path for a block with modifier', function() {
            expect(
                scheme('nested').path(
                    new BemCell({
                        entity: new BemEntityName({ block: 'a', modName: 'mn', modVal: 'mv' }),
                        tech: 'js'
                    })
                )
            ).eql('a/_mn/a_mn_mv.js');
        });

        it('should return path for a block with boolean modifier', function() {
            expect(
                scheme('nested').path(
                new BemCell({
                    entity: new BemEntityName({block: 'a', mod: {name: 'mn', val: true }}),
                    tech: 'js'
                }))
            ).eql('a/_mn/a_mn.js');
        });

        it('should return path for a block with modifier without value', function() {
            expect(
                scheme('nested').path(
                    new BemCell({
                        entity: new BemEntityName({block: 'a', mod: {name: 'mn'}}),
                        tech: 'js'
                    })
                )
            ).eql('a/_mn/a_mn.js');
        });

        it('should return path for elem', function() {
            expect(
                scheme('nested').path(
                    new BemCell({
                        entity: new BemEntityName({block: 'a', elem: 'e1'}),
                        tech: 'js'
                    })
                )
            ).eql('a/__e1/a__e1.js');
        });

        it('should return path for modName elem', function() {
            expect(
                scheme('nested').path(
                    new BemCell({
                        entity: new BemEntityName({
                            block: 'a',
                            elem: 'e1',
                            mod: {name: 'mn', val: 'mv'}
                        }),
                        tech: 'js'
                    })
                )
            ).eql('a/__e1/_mn/a__e1_mn_mv.js');
        });

        it('should support optional naming style', function() {
            expect(
                scheme('nested').path(
                    new BemCell({
                        entity: new BemEntityName({
                            block: 'a',
                            elem: 'e1',
                            mod: {name: 'mn', val: 'mv'}
                        }),
                        tech: 'js'
                    }),
                    {naming: {elem: '%%%', mod: '###'}}
                )
            ).eql('a/%%%e1/###mn/a%%%e1###mn###mv.js');
        });

        it('should support optional tech for BemCell', function() {
            expect(
                scheme('nested').path(
                    new BemCell({
                        entity: new BemEntityName({
                            block: 'a',
                            elem: 'e1',
                            mod: {name: 'mn', val: 'mv'}
                        })
                    })
                )
            ).eql('a/__e1/_mn/a__e1_mn_mv');
        });

        it('should support layer for BemCell', function() {
            expect(
                scheme('nested').path(
                    new BemCell({
                        entity: new BemEntityName({
                            block: 'a',
                            elem: 'e1',
                            mod: {name: 'mn', val: 'mv'}
                        }),
                        tech: 'js',
                        layer: 'common.blocks'
                    })
                )
            ).eql('common.blocks/a/__e1/_mn/a__e1_mn_mv.js');
        });
    });

    describe('lib/schemes/flat', function() {
        it('should return path for a block', function() {
            expect(scheme('flat').path(
                new BemCell({
                    entity: new BemEntityName({block: 'a'}),
                    tech: 'js'
                })
            )).eql('a.js');
        });

        it('should throw when you use not BemCell', function() {
            expect(
                scheme('flat').path.bind(null, new BemEntityName({block: 'a'}))
            ).to.throw(/@bem\/cell/);
        });

        it('should return path for a block with modifier', function() {
            expect(scheme('flat').path(
                new BemCell({
                    entity: new BemEntityName({block: 'a', mod: {name: 'mn', val: 'mv'}}),
                    tech: 'js'
                })
            )).eql('a_mn_mv.js');
        });

        it('should return path for elem', function() {
            expect(
                scheme('flat').path(
                    new BemCell({
                        entity: new BemEntityName({block: 'a', elem: 'e1'}),
                        tech: 'js'
                    })
                )
            ).eql('a__e1.js');
        });

        it('should return path for modName elem', function() {
            expect(
                scheme('flat').path(
                    new BemCell({
                        entity: new BemEntityName({
                            block: 'a',
                            elem: 'e1',
                            mod: {name: 'mn', val: 'mv'}
                        }),
                        tech: 'js'
                    })
                )
            ).eql('a__e1_mn_mv.js');
        });

        it('should support optional naming style', function() {
            expect(
                scheme('flat').path(
                    new BemCell({
                        entity: new BemEntityName({
                            block: 'a',
                            elem: 'e1',
                            mod: {name: 'mn', val: 'mv'}
                        }),
                        tech: 'js'
                    }),
                    {naming: {elem: '%%%', mod: '###'}}
                )
            ).eql('a%%%e1###mn###mv.js');
        });

        it('should support optional tech for BemCell', function() {
            expect(
                scheme('flat').path(
                    new BemCell({
                        entity: new BemEntityName({
                            block: 'a',
                            elem: 'e1',
                            mod: {name: 'mn', val: 'mv'}
                        })
                    })
                )
            ).eql('a__e1_mn_mv');
        });

        it('should support layer for BemCell', function() {
            expect(
                scheme('flat').path(
                    new BemCell({
                        entity: new BemEntityName({
                            block: 'a',
                            elem: 'e1',
                            mod: {name: 'mn', val: 'mv'}
                        }),
                        tech: 'js',
                        layer: 'common.blocks'
                    })
                )
            ).eql('common.blocks/a__e1_mn_mv.js');
        });
    });
});
