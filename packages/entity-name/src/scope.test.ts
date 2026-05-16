import { expect } from 'chai';

import { BemEntityName } from './entity-name.js';

describe('scope', () => {
  it('should return scope of block', () => {
    const entityName = new BemEntityName({ block: 'block' });
    expect(entityName.scope).to.equal(null);
  });

  it('should return scope of block modifier', () => {
    const entityName = new BemEntityName({ block: 'block', mod: 'mod' });
    expect(entityName.scope?.valueOf()).to.deep.equal({ block: 'block' });
  });

  it('should return same scope for simple and complex mod', () => {
    const simpleMod = new BemEntityName({ block: 'block', mod: 'mod' });
    const complexMod = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });
    expect(simpleMod.scope).to.deep.equal(complexMod.scope);
  });

  it('should return scope of element', () => {
    const entityName = new BemEntityName({ block: 'block', elem: 'elem' });
    expect(entityName.scope?.valueOf()).to.deep.equal({ block: 'block' });
  });

  it('should return scope of element modifier', () => {
    const entityName = new BemEntityName({ block: 'block', elem: 'elem', mod: 'mod' });
    expect(entityName.scope?.valueOf()).to.deep.equal({ block: 'block', elem: 'elem' });
  });

  it('should cache scope value', () => {
    const entity = new BemEntityName({ block: 'block', elem: 'elem' });
    const first = entity.scope;
    const second = entity.scope;
    expect(first).to.equal(second);
  });
});
