import { expect } from 'chai';

import { BemEntityName } from '@bem/sdk.entity-name';

import { BemCell } from './cell.js';

describe('BemCell.create', () => {
  it('returns instance as-is when given a BemCell', () => {
    const cell = new BemCell({ entity: new BemEntityName({ block: 'b' }) });
    expect(BemCell.create(cell)).to.equal(cell);
  });

  it('wraps a passed BemEntityName', () => {
    const entity = new BemEntityName({ block: 'b' });
    expect(BemCell.create(entity).entity).to.equal(entity);
  });

  it('creates a block cell from flat options', () => {
    const cell = BemCell.create({ block: 'b' });
    expect(cell).to.be.instanceOf(BemCell);
    expect(cell.entity.block).to.equal('b');
  });

  it('creates an elem cell from flat options', () => {
    const cell = BemCell.create({ block: 'b', elem: 'e' });
    expect(cell.entity.valueOf()).to.deep.equal({ block: 'b', elem: 'e' });
  });

  it('creates cell with tech', () => {
    const cell = BemCell.create({ block: 'block', tech: 'css' });
    expect(cell.tech).to.equal('css');
  });

  it('creates cell with layer', () => {
    const cell = BemCell.create({ block: 'block', layer: 'desktop' });
    expect(cell.layer).to.equal('desktop');
  });

  it('creates cell with tech and layer', () => {
    const cell = BemCell.create({ block: 'block', tech: 'css', layer: 'desktop' });
    expect(cell.tech).to.equal('css');
    expect(cell.layer).to.equal('desktop');
  });

  it('flattens block + elem + mod + val', () => {
    const cell = BemCell.create({
      block: 'b',
      elem: 'e',
      mod: 'm',
      val: 'v',
      tech: 't',
      layer: 'l',
    });
    expect(cell.valueOf()).to.deep.equal({
      entity: { block: 'b', elem: 'e', mod: { name: 'm', val: 'v' } },
      tech: 't',
      layer: 'l',
    });
  });

  it('respects explicit `entity` field with tech/layer outside', () => {
    const cell = BemCell.create({
      entity: { block: 'b', mod: 'm', val: 'v' },
      tech: 't',
      layer: 'l',
    });
    expect(cell.valueOf()).to.deep.equal({
      entity: { block: 'b', mod: { name: 'm', val: 'v' } },
      tech: 't',
      layer: 'l',
    });
  });
});
