import { expect } from 'chai';

import { BemFile } from './file.js';

describe('id', () => {
  it('uses cell.id when no level', () => {
    const file = new BemFile({
      cell: { entity: { block: 'block' }, layer: 'desktop', tech: 'css' },
    });
    expect(file.id).to.equal('block@desktop.css');
  });

  it('uses cell.id with entity-only cell', () => {
    const file = new BemFile({ cell: { entity: { block: 'block' } } });
    expect(file.id).to.equal('block');
  });

  it('uses cell.id with tech-only cell', () => {
    const file = new BemFile({
      cell: { entity: { block: 'block' }, tech: 'css' },
    });
    expect(file.id).to.equal('block.css');
  });

  it('uses cell.id with layer-only cell', () => {
    const file = new BemFile({
      cell: { entity: { block: 'block' }, layer: 'desktop' },
    });
    expect(file.id).to.equal('block@desktop');
  });

  it('prefixes with level/', () => {
    const file = new BemFile({
      cell: { entity: { block: 'block' }, layer: 'desktop' },
      level: 'abc/def',
    });
    expect(file.id).to.equal('abc/def/block@desktop');
  });
});
