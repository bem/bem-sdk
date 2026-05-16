import { expect } from 'chai';

import { BemFile } from './file.js';

describe('fields', () => {
  it('provides `cell`', () => {
    const file = new BemFile({ cell: { block: 'block', tech: 'css' } });
    expect(file.cell.valueOf()).to.deep.equal({
      entity: { block: 'block' },
      tech: 'css',
    });
  });

  it('provides `entity`', () => {
    const file = new BemFile({ cell: { block: 'block', tech: 'css' } });
    expect(file.entity.valueOf()).to.deep.equal({ block: 'block' });
  });

  it('provides `tech`', () => {
    const file = new BemFile({ cell: { block: 'block', tech: 'css' } });
    expect(file.tech).to.equal('css');
  });

  it('provides `layer`', () => {
    const file = new BemFile({ cell: { block: 'block', layer: 'desktop' } });
    expect(file.layer).to.equal('desktop');
  });
});
