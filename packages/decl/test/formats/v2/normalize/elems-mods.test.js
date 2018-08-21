'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../../../util').simplifyCell;
const normalize = require('../../../../lib/formats/v2/normalize');

describe('normalize2.elems-mods', () => {
    it('should support elem as object and mod', () => {
        const decl = {
            block: 'block',
            elems: {
                elem: 'elem',
                mods: {
                    mod1: 'v1'
                }
            }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: 'v1' }, tech: null }
        ]);
    });

    it('should support elem of elem as array mods', () => {
        const decl = {
            block: 'block',
            elems: [
                {
                    elem: ['elem1', 'elem2'],
                    mods: {
                        m1: 'v1'
                    }
                }
            ]
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem1' }, tech: null },
            { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: 'v1' }, tech: null },
            { entity: { block: 'block', elem: 'elem2' }, tech: null },
            { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: 'v1' }, tech: null }
        ]);
    });

    it('should support mods in elems and block', () => {
        const decl = {
            block: 'block',
            mods: {
                m1: 'v1'
            },
            elems: [
                {
                    elem: 'elem',
                    mods: {
                        m2: 'v2'
                    }
                }
            ]
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'm2', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'm2', modVal: 'v2' }, tech: null }
        ]);
    });

    it('should support block mods with `elems` field without block', () => {
        const decl = [
            {
                elems: ['close'],
                mods: { theme: 'protect' }
            }
        ];

        expect(normalize(decl, { entity: { block: 'sb' } }).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'sb' }, tech: null },
            { entity: { block: 'sb', modName: 'theme', modVal: true }, tech: null },
            { entity: { block: 'sb', modName: 'theme', modVal: 'protect' }, tech: null },
            { entity: { block: 'sb', elem: 'close' }, tech: null }
        ]);
    });

    it('should support elem of elem with array mods', () => {
        const decl = {
            block: 'block',
            elems: {
                elem: 'elem',
                mods: ['m1', 'm2']
            }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'm2', modVal: true }, tech: null }
        ]);
    });
});
