import { expect } from 'chai';

import { BemEntityName } from '@bem/sdk.entity-name';

import { BemCell } from './cell.js';

describe('toJSON', () => {
  it('serializes cell entity + tech', () => {
    const cell = new BemCell({
      entity: new BemEntityName({ block: 'button' }),
      tech: 'olala',
    });
    expect(JSON.stringify([cell])).to.equal(
      '[{"entity":{"block":"button"},"tech":"olala"}]',
    );
  });
});
