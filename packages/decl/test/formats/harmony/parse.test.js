import { assert } from 'chai';

import { simplifyCell } from '../../util.js';
import harmonyFormat from '../../../lib/formats/harmony/index.js';

const { parse } = harmonyFormat;

describe('decl.formats.harmony.parse', () => {
    it('should throw if invalid format', () => {
        assert.throw(() => parse([{ block: 'block' }]), 'Invalid format of harmony declaration');
    });

    it('should parse empty decl', () => {
        const cells = parse({ format: 'harmony', decl: [] });

        assert.deepEqual(cells.map(simplifyCell), []);
    });

    it('should parse decl with format field', () => {
        const cells = parse({ format: 'harmony', decl: [{ block: 'block' }] });

        assert.deepEqual(cells.map(simplifyCell), [{ entity: { block: 'block' }, tech: null }]);
    });

    it('should parse entity', () => {
        const cells = parse({ decl: [{ block: 'block' }] });

        assert.deepEqual(cells.map(simplifyCell), [{ entity: { block: 'block' }, tech: null }]);
    });
});
