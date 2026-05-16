import { expect } from 'chai';

import { BemEntityName } from '@bem/sdk.entity-name';

import { BemCell } from './cell.js';

describe('constructor — fields', () => {
  it('provides `entity`', () => {
    const cell = new BemCell({ entity: new BemEntityName({ block: 'block' }) });
    expect(cell.entity.valueOf()).to.deep.equal({ block: 'block' });
  });

  it('provides `tech`', () => {
    const cell = new BemCell({
      entity: new BemEntityName({ block: 'block' }),
      tech: 'css',
    });
    expect(cell.tech).to.equal('css');
  });

  it('provides `layer`', () => {
    const cell = new BemCell({
      entity: new BemEntityName({ block: 'block' }),
      layer: 'desktop',
    });
    expect(cell.layer).to.equal('desktop');
  });
});

describe('constructor — validation', () => {
  it('throws on missing args', () => {
    expect(() => new BemCell(undefined as unknown as ConstructorParameters<typeof BemCell>[0])).to.throw(
      'Required `entity` field',
    );
  });

  it('throws on missing `entity`', () => {
    expect(() => new BemCell({} as unknown as ConstructorParameters<typeof BemCell>[0])).to.throw(
      'Required `entity` field',
    );
  });

  it('throws on plain-object entity', () => {
    expect(
      () =>
        new BemCell({
          entity: { block: 'block' } as unknown as BemEntityName,
        }),
    ).to.throw('The `entity` field should be an instance of BemEntityName');
  });

  it('does not throw on valid entity', () => {
    expect(
      () => new BemCell({ entity: new BemEntityName({ block: 'block' }) }),
    ).to.not.throw();
  });
});
