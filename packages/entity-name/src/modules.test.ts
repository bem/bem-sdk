import { expect } from 'chai';

import defaultExport, { BemEntityName } from './index.js';

describe('modules', () => {
  it('should export class as default', () => {
    expect(defaultExport).to.equal(BemEntityName);
  });

  it('should expose `isBemEntityName` static', () => {
    expect(typeof BemEntityName.isBemEntityName).to.equal('function');
  });

  it('should expose `create` static', () => {
    expect(typeof BemEntityName.create).to.equal('function');
  });
});
