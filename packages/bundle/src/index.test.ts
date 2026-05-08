import { expect } from 'chai';
import { convert as bemjsonConvert } from '@bem/sdk.bemjson-to-decl';

import { BemBundle } from './index.js';

describe('bundle / calculated fields', () => {
  it('generates bemdecl from bemjson', () => {
    const bemjson = {
      block: 'block',
      content: { elem: 'elem' },
    };
    const bundle = new BemBundle({ name: 'common', bemjson });
    expect(bundle.decl).to.deep.equal(bemjsonConvert(bemjson));
  });

  it('derives name from path', () => {
    const bundle = new BemBundle({
      path: './desktop.bundles/index',
      bemjson: { block: 'block' },
    });
    expect(bundle.name).to.equal('index');
  });
});

describe('bundle / exceptions', () => {
  it('throws if no bemjson and bemdecl', () => {
    expect(() => new BemBundle({} as never)).to.throw(
      'BEMJSON or BEMDECL must be present',
    );
  });

  it('throws if bemjson is not an object', () => {
    expect(
      () => new BemBundle({ bemjson: 'bemjson' as never } as never),
    ).to.throw('BEMJSON should be an object');
  });

  it('throws if levels is not an array', () => {
    expect(
      () =>
        new BemBundle({
          bemjson: { block: 'block' },
          levels: 'desktop.blocks' as never,
        } as never),
    ).to.throw('Levels must be array of string');
  });

  it('throws if neither name nor path is present', () => {
    expect(() => new BemBundle({ bemjson: { block: 'block' } })).to.throw(
      'Bundle name or path must be present',
    );
  });
});

describe('bundle / field types', () => {
  const bundle = new BemBundle({
    name: 'common',
    bemjson: { block: 'block' },
  });

  it('name is a string', () => {
    expect(bundle.name).to.be.a('string');
  });

  it('decl is an array', () => {
    expect(bundle.decl).to.be.an('array');
  });

  it('bemjson is an object', () => {
    expect(bundle.bemjson).to.be.an('object');
  });

  it('path is a string', () => {
    expect(bundle.path).to.be.a('string');
  });

  it('levels is an array', () => {
    expect(bundle.levels).to.be.an('array');
  });
});

describe('bundle / isBundle', () => {
  it('validates a real BemBundle', () => {
    const bundle = new BemBundle({
      name: 'common',
      bemjson: { block: 'block' },
    });
    expect(BemBundle.isBundle(bundle)).to.equal(true);
  });

  it('rejects a plain object', () => {
    expect(BemBundle.isBundle({})).to.equal(false);
  });
});
