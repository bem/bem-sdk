import { expect } from 'chai';

import { BemjsonNode } from './index.js';

describe('constructor', () => {
  it('should create block', () => {
    const obj = { block: 'block', mods: {} };
    const node = new BemjsonNode(obj);

    expect(node.valueOf()).to.deep.equal(obj);
  });

  it('should create modifier of block', () => {
    const obj = { block: 'block', mods: { mod: 'val' } };
    const node = new BemjsonNode(obj);

    expect(node.valueOf()).to.deep.equal(obj);
  });

  it('should create element', () => {
    const obj = { block: 'block', mods: {}, elem: 'elem', elemMods: {} };
    const node = new BemjsonNode(obj);

    expect(node.valueOf()).to.deep.equal(obj);
  });

  it('should create modifier of element', () => {
    const obj = {
      block: 'block',
      mods: {},
      elem: 'elem',
      elemMods: { mod: 'val' },
    };
    const node = new BemjsonNode(obj);

    expect(node.valueOf()).to.deep.equal(obj);
  });

  it('should create mixes', () => {
    const obj = {
      block: 'block',
      mods: {},
      mix: [{ block: 'mixed', mods: {} }],
    };
    const node = new BemjsonNode(obj);

    expect(node.valueOf()).to.deep.equal(obj);
  });
});

describe('errors', () => {
  it('should throw error if no `block` field', () => {
    expect(
      () =>
        new BemjsonNode({ elem: 'elem' } as unknown as Parameters<
          typeof BemjsonNode
        >[0]),
    ).to.throw(/`block` field should be a non empty string/);
  });

  it('should throw error if `elem` field has non-string value', () => {
    expect(
      () =>
        new BemjsonNode({ block: 'b', elem: {} } as unknown as Parameters<
          typeof BemjsonNode
        >[0]),
    ).to.throw(/`elem` field should be a non-empty string/);
  });

  it('should throw error if `elemMods` field is provided without `elem`', () => {
    expect(
      () => new BemjsonNode({ block: 'block', elemMods: {} }),
    ).to.throw(/`elemMods` field should not be used without `elem` field/);
  });

  it('should throw error if `mods` field has invalid value', () => {
    expect(
      () =>
        new BemjsonNode({
          block: 'block',
          mods: 'string',
        } as unknown as Parameters<typeof BemjsonNode>[0]),
    ).to.throw(/`mods` field should be a simple object or null/);
  });

  it('should throw error if `elemMods` field has invalid value', () => {
    expect(
      () =>
        new BemjsonNode({
          block: 'block',
          elem: 'e',
          elemMods: 'string',
        } as unknown as Parameters<typeof BemjsonNode>[0]),
    ).to.throw(/`elemMods` field should be a simple object or null/);
  });
});

describe('normalize', () => {
  it('should normalize `mods` field', () => {
    const node = new BemjsonNode({ block: 'block' });
    expect(node.mods).to.be.an('object');
  });

  it('should normalize `elemMods` field', () => {
    const node = new BemjsonNode({ block: 'block', elem: 'q' });
    expect(node.elemMods).to.be.an('object');
  });

  it('should normalize `mix` field into array', () => {
    const mixedNode = new BemjsonNode({ block: 'mixed' });
    const node = new BemjsonNode({ block: 'block', mix: mixedNode });

    expect(node.mix).to.be.an('array');
    expect(node.mix[0]).to.equal(mixedNode);
  });

  it('should normalize string value in `mix` field', () => {
    const node = new BemjsonNode({ block: 'block', mix: 'mixed' });

    expect(BemjsonNode.isBemjsonNode(node.mix[0])).to.equal(true);
    expect(node.mix[0]!.block).to.equal('mixed');
  });

  it('should normalize object value in `mix` field', () => {
    const node = new BemjsonNode({
      block: 'b1',
      mix: { block: 'b1', elem: 'e1' },
    });

    expect(BemjsonNode.isBemjsonNode(node.mix[0])).to.equal(true);
    expect(node.mix[0]!.elem).to.equal('e1');
  });
});
