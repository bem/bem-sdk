import { inspect } from 'node:util';

import { expect } from 'chai';

import { BemEntityName } from './entity-name.js';

describe('inspect', () => {
  it('should return entity object', () => {
    const entityName = new BemEntityName({ block: 'block' });
    expect(inspect(entityName)).to.equal("BemEntityName { block: 'block' }");
  });
});
