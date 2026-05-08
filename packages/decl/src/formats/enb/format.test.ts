import { expect } from 'chai';

import { cellify } from '../../cellify.js';
import { format } from './format.js';

describe('enb.format', () => {
  it('formats a block', () => {
    expect(format(cellify({ block: 'block' }))).to.deep.equal([{ block: 'block' }]);
  });

  it('formats block with tech', () => {
    expect(
      format(cellify({ entity: { block: 'block' }, tech: 'tech' })),
    ).to.deep.equal([{ block: 'block', tech: 'tech' }]);
  });

  it('formats elem', () => {
    expect(format(cellify({ block: 'block', elem: 'elem' }))).to.deep.equal([
      { block: 'block', elem: 'elem' },
    ]);
  });

  it('formats valued mod', () => {
    expect(
      format(cellify({ block: 'block', mod: { name: 'mod', val: 'val' } })),
    ).to.deep.equal([{ block: 'block', mod: 'mod', val: 'val' }]);
  });

  it('formats simple (boolean) mod', () => {
    expect(format(cellify({ block: 'block', mod: 'mod' }))).to.deep.equal([
      { block: 'block', mod: 'mod' },
    ]);
  });

  it('formats elem + valued mod', () => {
    expect(
      format(
        cellify({ block: 'block', elem: 'elem', mod: 'mod', val: 'val' }),
      ),
    ).to.deep.equal([{ block: 'block', elem: 'elem', mod: 'mod', val: 'val' }]);
  });

  it('formats elem + simple mod', () => {
    expect(
      format(cellify({ block: 'block', elem: 'elem', mod: 'mod' })),
    ).to.deep.equal([{ block: 'block', elem: 'elem', mod: 'mod' }]);
  });
});
