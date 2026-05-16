import { expect } from 'chai';

import BemBundleDefault, { BemBundle } from './index.js';

describe('bundle / module exports', () => {
  it('exposes BemBundle as a named export', () => {
    expect(BemBundle).to.be.a('function');
  });

  it('exposes BemBundle as default export', () => {
    expect(BemBundleDefault).to.equal(BemBundle);
  });
});
