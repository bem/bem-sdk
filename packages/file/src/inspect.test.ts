import { inspect } from 'node:util';

import { expect } from 'chai';

import { BemFile } from './file.js';

describe('inspect', () => {
  it('renders BemFile { cell, level }', () => {
    const file = new BemFile({
      cell: { entity: { block: 'block' }, tech: 'css' },
      level: 'asd/qwe',
    });
    expect(inspect(file)).to.match(
      /BemFile \{ cell: \{ entity: \{ block: 'block' \}, tech: 'css' \},\s+level: 'asd\/qwe' \}/,
    );
  });
});
