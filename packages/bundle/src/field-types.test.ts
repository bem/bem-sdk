import { expect } from 'chai';

import { BemBundle } from './index.js';

describe('Result object fields', () => {
  let bundle: BemBundle;

  before(() => {
    bundle = new BemBundle({
      name: 'common',
      bemjson: {
        block: 'block',
      },
      data: {
        recursive: true,
      },
    });
  });

  it('name should be a string', () => {
    expect(bundle.name).to.be.a('string');
  });

  it('bemdecl should be an array', () => {
    expect(bundle.decl).to.be.an('array');
  });

  it('bemjson should be an object', () => {
    expect(bundle.bemjson).to.be.an('object');
  });

  it('path should be a string', () => {
    expect(bundle.path).to.be.a('string');
  });

  it('levels should be an array', () => {
    expect(bundle.levels).to.be.an('array');
  });
});
