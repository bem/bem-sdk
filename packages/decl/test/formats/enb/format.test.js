import { assert } from 'chai';

import cellify from '../../../lib/cellify.js';
import format from '../../../lib/formats/enb/format.js';

describe('decl.formats.enb.format', () => {
    it('should format block', () => {
        const cells = cellify({ block: 'block' });

        const formatted = format(cells);

        assert.deepEqual(formatted, [{ block: 'block' }]);
    });

    it('should format block with tech', () => {
        const cells = cellify({ entity: { block: 'block' }, tech: 'tech' });

        const formatted = format(cells);

        assert.deepEqual(formatted, [{ block: 'block', tech: 'tech' }]);
    });

    it('should format elem', () => {
        const cells = cellify({ block: 'block', elem: 'elem' });

        const formatted = format(cells);

        assert.deepEqual(formatted, [{ block: 'block', elem: 'elem' }]);
    });

    it('should format mod', () => {
        const cells = cellify({ block: 'block', mod: { name: 'mod', val: 'val' } });

        const formatted = format(cells);

        assert.deepEqual(formatted, [{ block: 'block', mod: 'mod', val: 'val' }]);
    });

    it('should format simple mod', () => {
        const cells = cellify({ block: 'block', mod: 'mod' });

        const formatted = format(cells);

        assert.deepEqual(formatted, [{ block: 'block', mod: 'mod' }]);
    });

    it('should format elem mod', () => {
        const cells = cellify({ block: 'block', elem: 'elem', mod: 'mod', val: 'val' });

        const formatted = format(cells);

        assert.deepEqual(formatted, [{ block: 'block', elem: 'elem', mod: 'mod', val: 'val' }]);
    });

    it('should format elem simple mod', () => {
        const cells = cellify({ block: 'block', elem: 'elem', mod: 'mod' });

        const formatted = format(cells);

        assert.deepEqual(formatted, [{ block: 'block', elem: 'elem', mod: 'mod' }]);
    });
});
