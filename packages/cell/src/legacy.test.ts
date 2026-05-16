import { expect } from 'chai';

import { BemEntityName } from '@bem/sdk.entity-name';

import { BemCell } from './cell.js';

const cell = new BemCell({
  entity: new BemEntityName({
    block: 'b',
    elem: 'e',
    mod: { name: 'm', val: 'v' },
  }),
});
const modLessCell = new BemCell({ entity: new BemEntityName({ block: 'b' }) });

const noop = (): void => {};

describe('legacy proxies', () => {
  beforeEach(() => process.on('deprecation', noop));
  afterEach(() => process.removeListener('deprecation', noop));

  it('proxies block', () => {
    expect(cell.block).to.equal(cell.entity.block);
  });

  it('proxies elem', () => {
    expect(cell.elem).to.equal(cell.entity.elem);
  });

  it('proxies modName', () => {
    expect(cell.modName).to.equal(cell.entity.mod?.name);
  });

  it('proxies modVal', () => {
    expect(cell.modVal).to.equal(cell.entity.mod?.val);
  });

  it('proxies mod', () => {
    expect(cell.mod).to.deep.equal(cell.entity.mod);
  });

  it('returns undefined modName on mod-less', () => {
    expect(modLessCell.modName).to.equal(undefined);
  });

  it('returns undefined modVal on mod-less', () => {
    expect(modLessCell.modVal).to.equal(undefined);
  });

  it('returns undefined mod on mod-less', () => {
    expect(modLessCell.mod).to.equal(undefined);
  });
});
