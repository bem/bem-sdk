import { expect } from 'chai';

import BemEntityName from '../index.js';

describe('value-of.test.js', () => {
    it('should return normalized object', () => {
        const entity = new BemEntityName({ block: 'block', mod: 'mod' });

        expect(entity.valueOf()).to.deep.equal({ block: 'block', mod: { name: 'mod', val: true } });
    });
});
