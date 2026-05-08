import { expect } from 'chai';

import { BemEntityName } from './entity-name.js';

describe('constructor', () => {
  it('should create block', () => {
    const obj = { block: 'block' };
    const entityName = new BemEntityName(obj);
    expect(entityName.valueOf()).to.deep.equal(obj);
  });

  it('should create modifier of block', () => {
    const obj = { block: 'block', mod: { name: 'mod', val: 'val' } };
    const entityName = new BemEntityName(obj);
    expect(entityName.valueOf()).to.deep.equal(obj);
  });

  it('should create element', () => {
    const obj = { block: 'block', elem: 'elem' };
    const entityName = new BemEntityName(obj);
    expect(entityName.valueOf()).to.deep.equal(obj);
  });

  it('should create modifier of element', () => {
    const obj = { block: 'block', elem: 'elem', mod: { name: 'mod', val: 'val' } };
    const entityName = new BemEntityName(obj);
    expect(entityName.valueOf()).to.deep.equal(obj);
  });
});

describe('constructor errors', () => {
  it('should throw error if not `block` field', () => {
    expect(() =>
      new BemEntityName({ elem: 'elem' } as unknown as ConstructorParameters<typeof BemEntityName>[0]),
    ).to.throw("the object `{ elem: 'elem' }` is not valid BEM entity, the field `block` is undefined");
  });

  it('should throw error if `mod` field is empty object', () => {
    expect(() =>
      new BemEntityName({ block: 'block', mod: {} as unknown as { name: string } }),
    ).to.throw("the object `{ block: 'block', mod: {} }` is not valid BEM entity, the field `mod.name` is undefined");
  });

  it('should throw error if `mod.name` field is undefined', () => {
    expect(() =>
      new BemEntityName({
        block: 'block',
        mod: { val: 'val' } as unknown as { name: string },
      }),
    ).to.throw("the object `{ block: 'block', mod: { val: 'val' } }` is not valid BEM entity, the field `mod.name` is undefined");
  });
});
