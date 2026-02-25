import { expect } from 'chai';

import { simplifyCell } from '../../../util.js';
import normalize from '../../../../lib/formats/v1/normalize.js';

describe('intersect.common', () => {
    it('should support undefined', () => {
        expect(normalize()).to.deep.equal([]);
    });

    it('should support empty array', () => {
        expect(normalize([])).to.deep.equal([]);
    });

    it('should support objects', () => {
        expect(normalize({ name: 'block' }).map(simplifyCell)).to.deep.equal(
            [{ entity: { block: 'block' }, tech: null }]
        );
    });

    it('should return set', () => {
        const decl = [
            { name: 'A' },
            { name: 'A' }
        ];

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'A' }, tech: null }
        ]);
    });

    it('should save order', () => {
        const decl = [
            { name: 'A' },
            { name: 'B' },
            { name: 'A' }
        ];

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'A' }, tech: null },
            { entity: { block: 'B' }, tech: null }
        ]);
    });

    it('should support array', () => {
        const decl = [
            { name: 'A' },
            { name: 'B' }
        ];

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'A' }, tech: null },
            { entity: { block: 'B' }, tech: null }
        ]);
    });
});
