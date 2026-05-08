import { expect } from 'chai';

import { BemEntityName } from '@bem/sdk.entity-name';

import { BemCell } from './cell.js';

describe('id', () => {
  it('combines entity, layer, tech', () => {
    const cell = new BemCell({
      entity: new BemEntityName({ block: 'block' }),
      layer: 'desktop',
      tech: 'css',
    });
    expect(cell.id).to.equal('block@desktop.css');
  });

  it('uses entity-only form when no tech/layer', () => {
    const cell = new BemCell({ entity: new BemEntityName({ block: 'block' }) });
    expect(cell.id).to.equal('block');
  });

  it('appends only tech', () => {
    const cell = new BemCell({
      entity: new BemEntityName({ block: 'block' }),
      tech: 'css',
    });
    expect(cell.id).to.equal('block.css');
  });

  it('appends only layer', () => {
    const cell = new BemCell({
      entity: new BemEntityName({ block: 'block' }),
      layer: 'desktop',
    });
    expect(cell.id).to.equal('block@desktop');
  });

  it('caches the value', () => {
    const cell = new BemCell({
      entity: new BemEntityName({ block: 'block' }),
      layer: 'desktop',
      tech: 'css',
    });
    const id = cell.id;
    expect(cell.id).to.equal(id);
  });
});
