'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemCell = require('@bem/sdk.cell');
const createCell = BemCell.create;

const merge = require('../../lib/merge');

describe('intersect.bem', () => {
    it('should merge block with its elem', () => {
        const block = [{ entity: { block: 'block' } }].map(createCell);
        const elem = [{ entity: { block: 'block', elem: 'elem' } }].map(createCell);

        expect(merge(block, elem)).to.deep.equal([].concat(block, elem));
    });

    it('should merge block with its mod', () => {
        const block = [{ entity: { block: 'block' } }].map(createCell);
        const mod = [{ entity: { block: 'block', modName: 'mod', modVal: 'val' } }].map(createCell);

        expect(merge(block, mod)).to.deep.equal([].concat(block, mod));
    });

    it('should merge block with its bool mod', () => {
        const block = [{ entity: { block: 'block' } }].map(createCell);
        const mod = [{ entity: { block: 'block', modName: 'mod', modVal: true } }].map(createCell);

        expect(merge(block, mod)).to.deep.equal([].concat(block, mod));
    });

    it('should merge elems of block', () => {
        const elem1 = [{ entity: { block: 'block', elem: 'elem-1' } }].map(createCell);
        const elem2 = [{ entity: { block: 'block', elem: 'elem-2' } }].map(createCell);

        expect(merge(elem1, elem2)).to.deep.equal([].concat(elem1, elem2));
    });

    it('should merge mods of block', () => {
        const mod1 = [{ entity: { block: 'block', modName: 'mod-1', modVal: true } }].map(createCell);
        const mod2 = [{ entity: { block: 'block', modName: 'mod-2', modVal: true } }].map(createCell);

        expect(merge(mod1, mod2)).to.deep.equal([].concat(mod1, mod2));
    });

    it('should merge mod vals of block mod', () => {
        const val1 = [{ entity: { block: 'block', modName: 'mod', modVal: 'val-1' } }].map(createCell);
        const val2 = [{ entity: { block: 'block', modName: 'mod', modVal: 'val-2' } }].map(createCell);

        expect(merge(val1, val2)).to.deep.equal([].concat(val1, val2));
    });

    it('should merge elem with its mod', () => {
        const elem = [{ entity: { block: 'block', elem: 'elem' } }].map(createCell);
        const mod = [{ entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } }].map(createCell);

        expect(merge(elem, mod)).to.deep.equal([].concat(elem, mod));
    });

    it('should merge elem with its bool mod', () => {
        const elem = [{ entity: { block: 'block', elem: 'elem' } }].map(createCell);
        const mod = [{ entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } }].map(createCell);

        expect(merge(elem, mod)).to.deep.equal([].concat(elem, mod));
    });

    it('should merge mods of elem', () => {
        const mod1 = [{ entity: { block: 'block', elem: 'elem', modName: 'mod-1', modVal: true } }].map(createCell);
        const mod2 = [{ entity: { block: 'block', elem: 'elem', modName: 'mod-2', modVal: true } }].map(createCell);

        expect(merge(mod1, mod2)).to.deep.equal([].concat(mod1, mod2));
    });

    it('should merge block in different techs', () => {
        const blockJs = [{ entity: { block: 'block' }, tech: 'js' }].map(createCell);
        const blockCss = [{ entity: { block: 'block' }, tech: 'css' }].map(createCell);

        expect(merge(blockJs, blockCss)).to.deep.equal([].concat(blockJs, blockCss));
    });
});
