import { assert } from 'chai';

import { simplifyCell } from '../../util.js';
import enbFormat from '../../../lib/formats/enb/index.js';

const { parse } = enbFormat;

describe('decl.formats.enb.parse', () => {
    it('should throw if invalid format', () => {
        assert.throw(() => parse([{ block: 'block' }]), 'Invalid format of enb declaration');
    });

    it('should parse decl with format field', () => {
        const cells = parse({ format: 'enb', deps: [{ block: 'block' }] });

        assert.deepEqual(cells.map(simplifyCell), [{ entity: { block: 'block' }, tech: null }]);
    });

    it('should parse entity', () => {
        const cells = parse({ deps: [{ block: 'block' }] });

        assert.deepEqual(cells.map(simplifyCell), [{ entity: { block: 'block' }, tech: null }]);
    });
});
