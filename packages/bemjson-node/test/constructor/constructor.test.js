import { describe, it } from 'mocha';
import { expect } from 'chai';

import BemjsonNode from '../../index.js';

describe('constructor tests', () => {

    it('should create block', () => {
        const obj = { block: 'block', mods: {} };
        const bemjsonNode = new BemjsonNode(obj);

        expect(bemjsonNode.valueOf()).to.deep.equal(obj);
    });

    it('should create modifier of block', () => {
        const obj = { block: 'block', mods: { mod: 'val' } };
        const bemjsonNode = new BemjsonNode(obj);

        expect(bemjsonNode.valueOf()).to.deep.equal(obj);
    });

    it('should create element', () => {
        const obj = { block: 'block', mods: {}, elem: 'elem', elemMods: {} };
        const bemjsonNode = new BemjsonNode(obj);

        expect(bemjsonNode.valueOf()).to.deep.equal(obj);
    });

    it('should create modifier of element', () => {
        const obj = { block: 'block', mods: {}, elem: 'elem', elemMods: { mod: 'val' } };
        const bemjsonNode = new BemjsonNode(obj);

        expect(bemjsonNode.valueOf()).to.deep.equal(obj);
    });

    it('should create mixes', () => {
        const obj = { block: 'block', mods: {}, mix: [{ block: 'mixed', mods: {} }] };
        const bemjsonNode = new BemjsonNode(obj);

        expect(bemjsonNode.valueOf()).to.deep.equal(obj);
    });
});
