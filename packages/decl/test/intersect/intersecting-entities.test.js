import { expect } from 'chai';

import { createCell } from '../util.js';
import intersect from '../../lib/intersect.js';

describe('intersect.intersecting-entities', () => {
    it('should intersect block with block', () => {
        const block = [{ entity: { block: 'block' }, tech: null }].map(createCell);

        expect(intersect(block, block)).to.deep.equal(block);
    });

    it('should intersect bool mod with bool mod', () => {
        const mod = [{ entity: { block: 'block', modName: 'mod', modVal: true }, tech: null }].map(createCell);

        expect(intersect(mod, mod)).to.deep.equal(mod);
    });

    it('should intersect mod with mod', () => {
        const mod = [{ entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null }].map(createCell);

        expect(intersect(mod, mod)).to.deep.equal(mod);
    });

    it('should intersect elem with elem', () => {
        const elem = [{ entity: { block: 'block', elem: 'elem' }, tech: null }].map(createCell);

        expect(intersect(elem, elem)).to.deep.equal(elem);
    });

    it('should intersect bool mod of elem with bool mod of elem', () => {
        const mod = [
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null }
        ].map(createCell);

        expect(intersect(mod, mod)).to.deep.equal(mod);
    });

    it('should intersect elem mod with elem mod', () => {
        const mod = [
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ].map(createCell);

        expect(intersect(mod, mod)).to.deep.equal(mod);
    });
});
