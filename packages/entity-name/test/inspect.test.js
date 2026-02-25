import { expect } from 'chai';
import { inspect } from 'node:util';

import BemEntityName from '../index.js';

describe('inspect.test.js', () => {
    it('should return entity object', () => {
        const obj = { block: 'block' };
        const entityName = new BemEntityName(obj);

        expect(inspect(entityName)).to.equal(`BemEntityName { block: 'block' }`);
    });
});
