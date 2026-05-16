import { expect } from 'chai';
import { convert as bemjsonToDecl } from '@bem/sdk.bemjson-to-decl';

import { BemBundle } from './index.js';

describe('bemjson given:', () => {
  it('should generate bemdecl by given bemjson', () => {
    const bemjson = {
      block: 'block',
      content: {
        elem: 'elem',
      },
    };
    const bundle = new BemBundle({
      name: 'common',
      bemjson,
    });

    expect(bundle.decl).to.deep.equal(bemjsonToDecl(bemjson));
  });
});

describe('path given: ', () => {
  it('should generate name by given path', () => {
    const bundle = new BemBundle({
      path: './desktop.bundles/index',
      bemjson: {
        block: 'block',
      },
    });

    expect(bundle.name).to.equal('index');
  });
});
