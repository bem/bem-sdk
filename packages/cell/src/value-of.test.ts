import { expect } from 'chai';

import { BemEntityName } from '@bem/sdk.entity-name';

import { BemCell } from './cell.js';

describe('valueOf', () => {
  it('returns entity-only representation', () => {
    const cell = new BemCell({ entity: new BemEntityName({ block: 'block' }) });
    expect(cell.valueOf()).to.deep.equal({ entity: { block: 'block' } });
  });

  it('includes tech', () => {
    const cell = new BemCell({
      entity: new BemEntityName({ block: 'block' }),
      tech: 'css',
    });
    expect(cell.valueOf()).to.deep.equal({ entity: { block: 'block' }, tech: 'css' });
  });

  it('includes layer', () => {
    const cell = new BemCell({
      entity: new BemEntityName({ block: 'block' }),
      layer: 'desktop',
    });
    expect(cell.valueOf()).to.deep.equal({
      entity: { block: 'block' },
      layer: 'desktop',
    });
  });

  it('includes both tech and layer', () => {
    const cell = new BemCell({
      entity: new BemEntityName({ block: 'block' }),
      tech: 'css',
      layer: 'desktop',
    });
    expect(cell.valueOf()).to.deep.equal({
      entity: { block: 'block' },
      tech: 'css',
      layer: 'desktop',
    });
  });
});
