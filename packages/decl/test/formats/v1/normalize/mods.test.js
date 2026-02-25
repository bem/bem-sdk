import { expect } from 'chai';

import { simplifyCell } from '../../../util.js';
import normalize from '../../../../lib/formats/v1/normalize.js';

describe('intersect.mods', () => {
    it('should support objects', () => {
        const decl = { name: 'block', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null }
        ]);
    });

    it('should support several items', () => {
        const decl = {
            name: 'block', mods: [
                { name: 'mod-1', vals: [{ name: 'val' }] },
                { name: 'mod-2', vals: [{ name: 'val' }] }
            ]
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod-1', modVal: 'val' }, tech: null },
            { entity: { block: 'block', modName: 'mod-2', modVal: 'val' }, tech: null }
        ]);
    });

    it('should support mod shortcut', () => {
        const decl = { name: 'block', mods: [{ name: 'mod' }] };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null }
        ]);
    });
});
