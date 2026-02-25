import { expect } from 'chai';

import { simplifyCell } from '../../../util.js';
import normalize from '../../../../lib/formats/v2/normalize.js';

describe('normalize2.elem-mod', () => {
    it('should support shortcut for bool mod of elem', () => {
        const decl = { block: 'block', elem: 'elem', mod: 'mod' };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null }
        ]);
    });

    it('should support bool mod of elem', () => {
        const decl = { block: 'block', elem: 'elem', mod: 'mod', val: true };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null }
        ]);
    });

    it('should support elem array mod', () => {
        const decl = {
            block: 'block',
            elem: ['elem1', 'elem2'],
            mod: 'm1',
            val: 'v1'
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: 'v1' }, tech: null },
            { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: 'v1' }, tech: null }
        ]);
    });

    it('should support elem of elem as array with mod', () => {
        const decl = {
            block: 'block',
            elem: {
                elem: ['elem1', 'elem2']
            },
            mod: 'm1',
            val: 'v1'
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: 'v1' }, tech: null },
            { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: 'v1' }, tech: null }
        ]);
    });
});
