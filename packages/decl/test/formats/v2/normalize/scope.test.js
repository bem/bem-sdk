import { expect } from 'chai';

import { simplifyCell } from '../../../util.js';
import normalize from '../../../../lib/formats/v2/normalize.js';

describe('normalize2.scope', () => {
    it('should consider block scope', () => {
        const decl = {};
        const scope = simplifyCell({ entity: { block: 'block' } });

        expect(normalize(decl, scope).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null }
        ]);
    });

    it('should consider scope for object with tech field', () => {
        const decl = { tech: 'js' };
        const scope = simplifyCell({ entity: { block: 'block' } });

        expect(normalize(decl, scope).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: 'js' }
        ]);
    });
});
