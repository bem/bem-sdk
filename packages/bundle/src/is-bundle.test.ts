import { expect } from 'chai';

import { BemBundle } from './index.js';

describe('isBundle', () => {
  it('should validate bemBundle', () => {
    const bundle = new BemBundle({
      name: 'common',
      bemjson: {
        block: 'block',
      },
    });

    expect(BemBundle.isBundle(bundle)).to.equal(true);
  });

  it('you should not pass!!1', () => {
    expect(BemBundle.isBundle({})).to.not.equal(true);
  });
});
