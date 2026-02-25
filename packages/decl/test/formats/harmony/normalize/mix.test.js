import { expect } from 'chai';

import { simplifyCell } from '../../../util.js';
import normalize from '../../../../lib/formats/harmony/normalize.js';

describe('normalize-harmony.mix', () => {
    it('should support mix', () => {
        const decl = {
            block: 'block',
            elems: ['elem-1', 'elem-2'],
            mods: ['mod-1', 'mod-2']
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem-1' }, tech: null },
            { entity: { block: 'block', elem: 'elem-2' }, tech: null },
            { entity: { block: 'block', modName: 'mod-1', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'mod-2', modVal: true }, tech: null }
        ]);
    });
});
