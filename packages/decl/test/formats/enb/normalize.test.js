import { assert } from 'chai';

import cellify from '../../../lib/cellify.js';
import normalize from '../../../lib/formats/enb/normalize.js';

describe('decl.formats.enb.normalize', () => {
    it('should normalize block', () => {
        const cells = normalize([{ block: 'block' }]);

        assert.deepEqual(cells, cellify({ block: 'block' }));
    });

    it('should normalize block with tech', () => {
        const cells = normalize([{ block: 'block', tech: 'tech' }]);

        assert.deepEqual(cells, cellify({ entity: 'block', tech: 'tech' }));
    });

    it('should normalize elem', () => {
        const cells = normalize([{ block: 'block', elem: 'elem' }]);

        assert.deepEqual(cells, cellify({ block: 'block', elem: 'elem' }));
    });

    it('should normalize mod', () => {
        const cells = normalize([{ block: 'block', mod: 'mod', val: 'val' }]);

        assert.deepEqual(cells, cellify({ block: 'block', mod: { name: 'mod', val: 'val' } }));
    });

    it('should normalize simple mod', () => {
        const cells = normalize([{ block: 'block', mod: 'mod' }]);

        assert.deepEqual(cells, cellify({ block: 'block', mod: 'mod' }));
    });

    it('should normalize boolean mod', () => {
        const cells = normalize([{ block: 'block', mod: 'mod', val: true }]);

        assert.deepEqual(cells, cellify({ block: 'block', mod: 'mod' }));
    });

    it('should normalize elem mod', () => {
        const cells = normalize([{ block: 'block', elem: 'elem', mod: 'mod', val: true }]);

        assert.deepEqual(cells, cellify({ block: 'block', elem: 'elem', mod: 'mod' }));
    });
});
