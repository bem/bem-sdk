import { expect } from 'chai';

import {
  create,
  getPreset,
  legacy,
  origin,
  originReact,
  react,
  twoDashes,
} from './index.js';

describe('naming.presets', () => {
  describe('built-in presets', () => {
    it('exports origin convention', () => {
      expect(origin.delims).to.deep.equal({
        elem: '__',
        mod: { name: '_', val: '_' },
      });
      expect(origin.fs.scheme).to.equal('nested');
    });

    it('exports two-dashes convention', () => {
      expect(twoDashes.delims).to.deep.equal({
        elem: '__',
        mod: { name: '--', val: '_' },
      });
    });

    it('exports react convention with @-layer pattern', () => {
      expect(react.fs.pattern).to.equal('${entity}${layer?@${layer}}.${tech}');
    });

    it('exports origin-react convention', () => {
      expect(originReact.delims.elem).to.equal('-');
    });

    it('legacy is an alias for origin', () => {
      expect(legacy).to.equal(origin);
    });
  });

  describe('getPreset()', () => {
    it('returns a preset by name', () => {
      expect(getPreset('origin')).to.equal(origin);
      expect(getPreset('two-dashes')).to.equal(twoDashes);
    });

    it('throws on unknown name', () => {
      expect(() => getPreset('does-not-exist')).to.throw(
        /`does-not-exist` naming is unknown/,
      );
    });
  });

  describe('create()', () => {
    it('returns origin by default', () => {
      expect(create()).to.equal(origin);
    });

    it('returns named preset for string argument', () => {
      expect(create('react')).to.equal(react);
    });

    it('throws on unknown preset string', () => {
      expect(() => create('totally-not-a-preset')).to.throw();
    });

    it('overrides delims.elem', () => {
      const result = create({ delims: { elem: '##' } });
      expect(result.delims.elem).to.equal('##');
      expect(result.delims.mod).to.deep.equal({ name: '_', val: '_' });
    });

    it('accepts string mod delim shorthand', () => {
      const result = create({ delims: { mod: '@@' } });
      expect(result.delims.mod).to.deep.equal({ name: '@@', val: '@@' });
    });

    it('lets fs.pattern be overridden', () => {
      const result = create({ fs: { pattern: 'custom-${entity}' } });
      expect(result.fs.pattern).to.equal('custom-${entity}');
    });
  });
});
