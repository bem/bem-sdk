import { expect } from 'chai';

import { stringifyWrapper, type NamingConvention } from './index.js';

const origin: NamingConvention = {
  delims: { elem: '__', mod: { name: '_', val: '_' } },
};

const stringify = stringifyWrapper(origin);

describe('naming.entity.stringify', () => {
  it('returns empty string for invalid notation', () => {
    expect(stringify({} as unknown as Parameters<typeof stringify>[0])).to.eql(
      '',
    );
  });

  it('stringifies a block', () => {
    expect(stringify({ block: 'block' })).to.eql('block');
  });

  it('stringifies a string-form modifier', () => {
    expect(stringify({ block: 'block', mod: 'mod' })).to.eql('block_mod');
  });

  it('stringifies a name-only modifier object', () => {
    expect(stringify({ block: 'block', mod: { name: 'mod' } })).to.eql(
      'block_mod',
    );
  });

  it('stringifies a name+val modifier', () => {
    expect(
      stringify({ block: 'block', mod: { name: 'mod', val: 'val' } }),
    ).to.eql('block_mod_val');
  });

  it('drops modifier with falsy val', () => {
    expect(
      stringify({ block: 'block', mod: { name: 'mod', val: false } }),
    ).to.eql('block');
    expect(stringify({ block: 'block', mod: { name: 'mod', val: '' } })).to.eql(
      'block',
    );
  });

  it('stringifies an element', () => {
    expect(stringify({ block: 'block', elem: 'elem' })).to.eql('block__elem');
  });

  it('stringifies an element + modifier', () => {
    expect(stringify({ block: 'block', elem: 'elem', mod: 'mod' })).to.eql(
      'block__elem_mod',
    );
  });
});
