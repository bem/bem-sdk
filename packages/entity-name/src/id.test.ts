import { expect } from 'chai';

import { BemEntityName } from './entity-name.js';

describe('id', () => {
  it('should build equal id for equal blocks', () => {
    const a = new BemEntityName({ block: 'block' });
    const b = new BemEntityName({ block: 'block' });
    expect(a.id).to.equal(b.id);
  });

  it('should build not equal id for not equal blocks', () => {
    const a = new BemEntityName({ block: 'block1' });
    const b = new BemEntityName({ block: 'block2' });
    expect(a.id).to.not.equal(b.id);
  });

  it('should follow origin naming convention', () => {
    expect(new BemEntityName({ block: 'b' }).id).to.equal('b');
    expect(new BemEntityName({ block: 'b', elem: 'e' }).id).to.equal('b__e');
    expect(new BemEntityName({ block: 'b', mod: 'm' }).id).to.equal('b_m');
    expect(
      new BemEntityName({ block: 'b', mod: { name: 'm', val: 'v' } }).id,
    ).to.equal('b_m_v');
  });

  it('should cache id value across reads', () => {
    const entity = new BemEntityName({ block: 'block' });
    const first = entity.id;
    const second = entity.id;
    expect(first).to.equal(second);
  });
});
