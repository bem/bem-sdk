import { inspect } from 'node:util';

import { expect } from 'chai';

import { BemEntityName } from '@bem/sdk.entity-name';

import { BemCell } from './cell.js';

describe('inspect', () => {
  it('returns BemCell { entity: …, tech: … }', () => {
    const cell = new BemCell({
      entity: new BemEntityName({ block: 'block' }),
      tech: 'css',
    });
    expect(inspect(cell)).to.equal(
      `BemCell { entity: { block: 'block' }, tech: 'css' }`,
    );
  });
});
