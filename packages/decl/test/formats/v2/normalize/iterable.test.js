import { expect } from 'chai';

import { simplifyCell } from '../../../util.js';
import normalize from '../../../../lib/formats/v2/normalize.js';

describe('normalize2.iterable', () => {
    it('should support iterable set', () => {
        const decl = new Set();

        decl.add({
            block: 'block'
        });
        decl.add({
            block: 'block1',
            elem: 'elem'
        });

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block1', elem: 'elem' }, tech: null }
        ]);
    });
});
