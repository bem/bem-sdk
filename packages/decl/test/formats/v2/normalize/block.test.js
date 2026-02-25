import { expect } from 'chai';

import { simplifyCell } from '../../../util.js';
import normalize from '../../../../lib/formats/v2/normalize.js';

describe('normalize2.block', () => {
    it('should support block', () => {
        expect(normalize({ block: 'block' }).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null }
        ]);
    });

    it('should support array of blocks', () => {
        expect(normalize([{ block: 'block1' }, { block: 'block2' }]).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block1' }, tech: null },
            { entity: { block: 'block2' }, tech: null }
        ]);
    });

    it('should support block as string', () => {
        expect(normalize(['block']).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null }
        ]);
    });

    it('should support array of blocks as strings', () => {
        expect(normalize(['block1', 'block2']).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block1' }, tech: null },
            { entity: { block: 'block2' }, tech: null }
        ]);
    });
});
