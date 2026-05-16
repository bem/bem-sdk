import { expect } from 'chai';

import { BemEntityName } from './entity-name.js';

describe('type', () => {
  it('should determine block', () => {
    const entityName = new BemEntityName({ block: 'block' });
    expect(entityName.type).to.equal('block');
  });

  it('should determine modifier of block', () => {
    const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod' } });
    expect(entityName.type).to.equal('blockMod');
  });

  it('should determine elem', () => {
    const entityName = new BemEntityName({ block: 'block', elem: 'elem' });
    expect(entityName.type).to.equal('elem');
  });

  it('should determine modifier of element', () => {
    const entityName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod' } });
    expect(entityName.type).to.equal('elemMod');
  });

  it('should cache type value', () => {
    const entity = new BemEntityName({ block: 'block' });
    expect(entity.type).to.equal(entity.type);
  });
});
