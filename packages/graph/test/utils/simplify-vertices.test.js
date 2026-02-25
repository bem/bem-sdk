import { expect } from 'chai';

import { simplifyVertices, createVertex } from '../../lib/test-utils.js';

describe('utils/simplify-vertices', () => {
    it('should simplify vertex', () => {
        expect(simplifyVertices([
            createVertex({ block: 'a' }),
            createVertex({ block: 'b', elem: 'e' }),
            createVertex({ block: 'c', modName: 'm', modVal: true })
        ])).to.deep.equal([
            { entity: { block: 'a' } },
            { entity: { block: 'b', elem: 'e' } },
            { entity: { block: 'c', mod: { name: 'm', val: true } } }
        ]);
    });
});
