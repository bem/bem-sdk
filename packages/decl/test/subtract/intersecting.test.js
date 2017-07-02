'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const subtract = require('../../lib/subtract');

describe('subtract.intersecting', () => {
    it('should subtract block from block', () => {
        const block = [{ block: 'block' }];

        expect(subtract(block, block)).to.deep.equal([]);
    });

    it('should subtract bool mod from bool mod', () => {
        const mod = [{ block: 'block', modName: 'mod', modVal: true }];

        expect(subtract(mod, mod)).to.deep.equal([]);
    });

    it('should subtract mod from mod', () => {
        const mod = [{ block: 'block', modName: 'mod', modVal: 'val' }];

        expect(subtract(mod, mod)).to.deep.equal([]);
    });

    it('should subtract elem from elem', () => {
        const elem = [{ block: 'block', elem: 'elem' }];

        expect(subtract(elem, elem)).to.deep.equal([]);
    });

    it('should subtract bool mod of elem from bool mod of elem', () => {
        const mod = [{ block: 'block', elem: 'elem', modName: 'mod', modVal: true }];

        expect(subtract(mod, mod)).to.deep.equal([]);
    });

    it('should subtract elem mod from elem mod', () => {
        const mod = [{ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }];

        expect(subtract(mod, mod)).to.deep.equal([]);
    });
});
