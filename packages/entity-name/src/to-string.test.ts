import { expect } from 'chai';

import { BemEntityName } from './entity-name.js';

describe('to-string', () => {
  it('should stringify a block', () => {
    expect(new BemEntityName({ block: 'block' }).toString()).to.equal('block');
  });

  it('should stringify an element', () => {
    expect(new BemEntityName({ block: 'block', elem: 'elem' }).toString()).to.equal(
      'block__elem',
    );
  });

  it('should stringify a block modifier', () => {
    expect(
      new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } }).toString(),
    ).to.equal('block_mod_val');
  });

  it('should stringify an element modifier', () => {
    expect(
      new BemEntityName({
        block: 'block',
        elem: 'elem',
        mod: { name: 'mod', val: 'val' },
      }).toString(),
    ).to.equal('block__elem_mod_val');
  });
});
