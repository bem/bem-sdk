import { expect } from 'chai';

import { BemCell } from '@bem/sdk.cell';

import { BemFile } from './file.js';

describe('BemFile.create', () => {
  it('returns instance as-is when given a BemFile', () => {
    const file = new BemFile({ cell: BemCell.create({ block: 'b' }) });
    expect(BemFile.create(file)).to.equal(file);
  });

  it('keeps an explicitly-passed BemCell', () => {
    const cell = BemCell.create({ block: 'b' });
    expect(BemFile.create(cell as never).cell).to.equal(cell);
  });

  it('creates BemFile from flat block options', () => {
    const file = BemFile.create({ block: 'b' });
    expect(file).to.be.instanceOf(BemFile);
    expect(file.cell.block).to.equal('b');
  });

  it('creates from elem options', () => {
    const file = BemFile.create({ block: 'b', elem: 'e' });
    expect(file.entity.valueOf()).to.deep.equal({ block: 'b', elem: 'e' });
  });

  it('forwards tech/layer to cell', () => {
    const file = BemFile.create({ block: 'block', tech: 'css', layer: 'desktop' });
    expect(file.tech).to.equal('css');
    expect(file.layer).to.equal('desktop');
  });

  it('flattens block + elem + mod + val + tech + layer', () => {
    const file = BemFile.create({
      block: 'b',
      elem: 'e',
      mod: 'm',
      val: 'v',
      tech: 't',
      layer: 'l',
    });
    expect(file.cell.valueOf()).to.deep.equal({
      entity: { block: 'b', elem: 'e', mod: { name: 'm', val: 'v' } },
      tech: 't',
      layer: 'l',
    });
  });

  it('respects nested entity field', () => {
    const file = BemFile.create({
      entity: { block: 'b', mod: 'm', val: 'v' },
      tech: 't',
      layer: 'l',
    });
    expect(file.cell.valueOf()).to.deep.equal({
      entity: { block: 'b', mod: { name: 'm', val: 'v' } },
      tech: 't',
      layer: 'l',
    });
  });
});
