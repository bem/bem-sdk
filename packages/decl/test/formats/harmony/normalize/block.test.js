import { expect } from 'chai';

import { simplifyCell } from '../../../util.js';
import normalize from '../../../../lib/formats/harmony/normalize.js';

describe('normalize-harmony.block', () => {
    it('should support block', () => {
        const block = { block: 'block' };

        expect(normalize(block).map(simplifyCell)).to.deep.equal([{ entity: block, tech: null }]);
    });

    it('should support block as string', () => {
        expect(normalize(['block']).map(simplifyCell)).to.deep.equal([{ entity: { block: 'block' }, tech: null }]);
    });
});
