import { expect } from 'chai';

import { stringifyFull } from './index.js';

describe('stringifyFull (#275)', () => {
  it('returns a string', () => {
    expect(stringifyFull('b:button')).to.be.a('string');
  });

  it('builds full form for block-only notation', () => {
    expect(stringifyFull('b:button')).to.equal('b:button');
  });

  it('builds full form for block with elem', () => {
    expect(stringifyFull('b:button e:text')).to.equal('b:button e:text');
  });

  it('builds full form for block with bool modifier', () => {
    expect(stringifyFull('b:popup m:autoclosable')).to.equal(
      'b:popup m:autoclosable',
    );
  });

  it('builds full form for block, elem and bool modifier', () => {
    expect(stringifyFull('b:button e:text m:pseudo')).to.equal(
      'b:button e:text m:pseudo',
    );
  });

  it('builds full form for block, elem and modifier with value', () => {
    expect(stringifyFull('b:button e:text m:theme=normal')).to.equal(
      'b:button e:text m:theme=normal',
    );
  });

  describe('with scope', () => {
    it('expands a bare modifier against block scope', () => {
      expect(stringifyFull('m:theme=normal', { block: 'button' })).to.equal(
        'b:button m:theme=normal',
      );
    });

    it('expands a bare elem against block scope', () => {
      expect(stringifyFull('e:text m:pseudo', { block: 'button2' })).to.equal(
        'b:button2 e:text m:pseudo',
      );
    });

    it('expands a bare modifier against elem scope', () => {
      expect(
        stringifyFull('m:pseudo', { block: 'button2', elem: 'text' }),
      ).to.equal('b:button2 e:text m:pseudo');
    });

    it('expands a bare tech against block scope', () => {
      expect(stringifyFull('t:css', { block: 'button2' })).to.equal(
        'b:button2 t:css',
      );
    });
  });
});
