import { expect } from 'chai';

import { simplifyCell } from '../../../util.js';
import normalize from '../../../../lib/formats/v2/normalize.js';

describe('normalize2.block-mods', () => {
    it('should support mod', () => {
        const decl = {
            block: 'block',
            mod: 'm1',
            val: 'v1'
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: null }
        ]);
    });

    it('should support mod with tech', () => {
        const decl = {
            block: 'block',
            mod: 'm1',
            val: 'v1',
            tech: 'js'
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', modName: 'm1', modVal: true }, tech: 'js' },
            { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: 'js' }
        ]);
    });
});
