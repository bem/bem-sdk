import { assert } from 'chai';

import { simplifyCell } from '../../util.js';
import v2Format from '../../../lib/formats/v2/index.js';

const { parse } = v2Format;

describe('decl.formats.v2.parse', () => {
    it('should throw if invalid format', () => {
        assert.throw(() => parse([{ block: 'block' }]), 'Invalid format of v2 declaration');
    });

    it('should parse decl with format field', () => {
        const cells = parse({ format: 'v2', decl: [{ block: 'block' }] });

        assert.deepEqual(cells.map(simplifyCell), [{ entity: { block: 'block' }, tech: null }]);
    });

    it('should parse entity', () => {
        const cells = parse({ decl: [{ block: 'block' }] });

        assert.deepEqual(cells.map(simplifyCell), [{ entity: { block: 'block' }, tech: null }]);
    });
});
