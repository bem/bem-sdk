import { expect } from 'chai';

import { BemEntityName } from './entity-name.js';

describe('belongs-to', () => {
  it('should not detect belonging between block and itself', () => {
    const blockName = new BemEntityName({ block: 'block' });
    expect(blockName.belongsTo(blockName)).to.be.false;
  });

  it('should not detect belonging between elem and itself', () => {
    const elemName = new BemEntityName({ block: 'block', elem: 'elem' });
    expect(elemName.belongsTo(elemName)).to.be.false;
  });

  it('should not detect belonging between block mod and itself', () => {
    const modName = new BemEntityName({ block: 'block', mod: 'mod' });
    expect(modName.belongsTo(modName)).to.be.false;
  });

  it('should not detect belonging between elem mod and itself', () => {
    const modName = new BemEntityName({ block: 'block', elem: 'elem', mod: 'mod' });
    expect(modName.belongsTo(modName)).to.be.false;
  });

  it('should resolve belonging between block and its elem', () => {
    const blockName = new BemEntityName({ block: 'block' });
    const elemName = new BemEntityName({ block: 'block', elem: 'elem' });
    expect(elemName.belongsTo(blockName)).to.be.true;
    expect(blockName.belongsTo(elemName)).to.be.false;
  });

  it('should not detect belonging between two block', () => {
    const name1 = new BemEntityName({ block: 'block1' });
    const name2 = new BemEntityName({ block: 'block2' });
    expect(name1.belongsTo(name2)).to.be.false;
    expect(name2.belongsTo(name1)).to.be.false;
  });

  it('should not detect belonging between two mods of block', () => {
    const a = new BemEntityName({ block: 'block', mod: 'mod1' });
    const b = new BemEntityName({ block: 'block', mod: 'mod2' });
    expect(a.belongsTo(b)).to.be.false;
    expect(b.belongsTo(a)).to.be.false;
  });

  it('should not detect belonging between two elems of block', () => {
    const a = new BemEntityName({ block: 'block', elem: 'elem1' });
    const b = new BemEntityName({ block: 'block', elem: 'elem2' });
    expect(a.belongsTo(b)).to.be.false;
    expect(b.belongsTo(a)).to.be.false;
  });

  it('should resolve belonging between block and its mod', () => {
    const blockName = new BemEntityName({ block: 'block' });
    const modName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'key' } });
    expect(modName.belongsTo(blockName)).to.be.true;
    expect(blockName.belongsTo(modName)).to.be.false;
  });

  it('should resolve belonging between elem and its mod', () => {
    const elemName = new BemEntityName({ block: 'block', elem: 'elem' });
    const modName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key' } });
    expect(modName.belongsTo(elemName)).to.be.true;
    expect(elemName.belongsTo(modName)).to.be.false;
  });

  it('should not detect belonging between block and its elem mod', () => {
    const blockName = new BemEntityName({ block: 'block' });
    const elemModName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key' } });
    expect(elemModName.belongsTo(blockName)).to.be.false;
    expect(blockName.belongsTo(elemModName)).to.be.false;
  });

  it('should not detect belonging between block mod and its elem with the same mod', () => {
    const blockMod = new BemEntityName({ block: 'block', mod: 'mod' });
    const elemMod = new BemEntityName({ block: 'block', elem: 'elem', mod: 'mod' });
    expect(elemMod.belongsTo(blockMod)).to.be.false;
    expect(blockMod.belongsTo(elemMod)).to.be.false;
  });

  it('should not detect belonging between boolean and key-value mod of block', () => {
    const boolMod = new BemEntityName({ block: 'block', mod: { name: 'mod', val: true } });
    const keyMod = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'key' } });
    expect(keyMod.belongsTo(boolMod)).to.be.false;
    expect(boolMod.belongsTo(keyMod)).to.be.false;
  });

  it('should not detect belonging between boolean and key-value mod of element', () => {
    const boolMod = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: true } });
    const keyMod = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key' } });
    expect(keyMod.belongsTo(boolMod)).to.be.false;
    expect(boolMod.belongsTo(keyMod)).to.be.false;
  });

  it('should not detect belonging between key-value mods of block', () => {
    const a = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'key1' } });
    const b = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'key2' } });
    expect(a.belongsTo(b)).to.be.false;
    expect(b.belongsTo(a)).to.be.false;
  });

  it('should not detect belonging between key-value mods of elem', () => {
    const a = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key1' } });
    const b = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key2' } });
    expect(a.belongsTo(b)).to.be.false;
    expect(b.belongsTo(a)).to.be.false;
  });
});
