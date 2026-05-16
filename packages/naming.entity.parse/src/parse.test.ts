import { expect } from 'chai';

import { origin } from '@bem/sdk.naming.presets';

import { bemNamingEntityParse } from './index.js';

const parse = bemNamingEntityParse(origin);

describe('bemNamingEntityParse (origin preset)', () => {
  it('parses block', () => {
    expect(parse('block')!.valueOf()).to.deep.equal({ block: 'block' });
  });

  it('parses element', () => {
    expect(parse('block__elem')!.valueOf()).to.deep.equal({
      block: 'block',
      elem: 'elem',
    });
  });

  it('parses block modifier with value', () => {
    expect(parse('block_mod_val')!.valueOf()).to.deep.equal({
      block: 'block',
      mod: { name: 'mod', val: 'val' },
    });
  });

  it('parses boolean block modifier', () => {
    expect(parse('block_mod')!.valueOf()).to.deep.equal({
      block: 'block',
      mod: { name: 'mod', val: true },
    });
  });

  it('parses element modifier with value', () => {
    expect(parse('block__elem_mod_val')!.valueOf()).to.deep.equal({
      block: 'block',
      elem: 'elem',
      mod: { name: 'mod', val: 'val' },
    });
  });

  it('returns undefined on garbage input', () => {
    expect(parse('___')).to.equal(undefined);
  });
});
