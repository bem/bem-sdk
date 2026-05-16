import { expect } from 'chai';

import { bemNaming } from './index.js';

describe('naming.entity / namespace', () => {
  it('exposes default parse on the factory', () => {
    const entity = ['block__elem'].map(bemNaming.parse)[0]!;
    expect(entity.valueOf()).to.deep.equal({ block: 'block', elem: 'elem' });
  });

  it('builds a namespace by default', () => {
    const myNaming = bemNaming();
    const entity = ['block__elem'].map(myNaming.parse)[0]!;
    expect(entity.valueOf()).to.deep.equal({ block: 'block', elem: 'elem' });
  });

  it('builds a custom namespace', () => {
    const myNaming = bemNaming({ delims: { elem: '==' } });
    const entity = ['block==elem'].map(myNaming.parse)[0]!;
    expect(entity.valueOf()).to.deep.equal({ block: 'block', elem: 'elem' });
  });
});

describe('naming.entity / fields', () => {
  it('has elem delim on the factory', () => {
    expect(bemNaming.delims.elem).to.be.ok;
  });

  it('has mod name delim on the factory', () => {
    expect(bemNaming.delims.mod.name).to.be.ok;
  });

  it('has mod val delim on the factory', () => {
    expect(bemNaming.delims.mod.val).to.be.ok;
  });

  it('builds a namespace with elem delim', () => {
    expect(bemNaming().delims.elem).to.be.ok;
  });

  it('builds a namespace with mod name delim', () => {
    expect(bemNaming().delims.mod.name).to.be.ok;
  });

  it('builds a namespace with mod val delim', () => {
    expect(bemNaming().delims.mod.val).to.be.ok;
  });
});

describe('naming.entity / cache', () => {
  it('caches the default naming instance', () => {
    expect(bemNaming()).to.equal(bemNaming());
  });

  it('treats different elem delim as a different cache key', () => {
    expect(bemNaming()).to.not.equal(bemNaming({ delims: { elem: '==' } }));
  });

  it('treats different mod delim as a different cache key', () => {
    expect(bemNaming()).to.not.equal(bemNaming({ delims: { mod: '=' } }));
  });

  it('treats different wordPattern as a different cache key', () => {
    expect(bemNaming()).to.not.equal(bemNaming({ wordPattern: '[a-z]+' }));
  });

  it('caches a custom naming with identical options', () => {
    const opts = { delims: { elem: '__', mod: '--' } };
    expect(bemNaming(opts)).to.equal(bemNaming(opts));
  });

  it('returns different instances for distinct mod delim', () => {
    expect(bemNaming({ delims: { elem: '__', mod: '_' } })).to.not.equal(
      bemNaming({ delims: { elem: '__', mod: '--' } }),
    );
  });
});

describe('naming.entity / options', () => {
  it('throws on unknown preset', () => {
    expect(() => bemNaming('my-preset')).to.throw(
      'The `my-preset` naming is unknown.',
    );
  });

  it('honors custom elem delim', () => {
    expect(bemNaming({ delims: { elem: '==' } }).delims.elem).to.equal('==');
  });

  it('supports mod option as string', () => {
    const myNaming = bemNaming({ delims: { mod: '--' } });
    expect(myNaming.delims.mod.name).to.equal('--');
    expect(myNaming.delims.mod.val).to.equal('--');
  });

  it('supports mod option as object', () => {
    const myNaming = bemNaming({ delims: { mod: { name: '--', val: '_' } } });
    expect(myNaming.delims.mod.name).to.equal('--');
    expect(myNaming.delims.mod.val).to.equal('_');
  });

  it('falls back to default mod.val if missing', () => {
    const myNaming = bemNaming({ delims: { mod: { name: '--' } as never } });
    expect(myNaming.delims.mod.name).to.equal('--');
    expect(myNaming.delims.mod.val).to.equal(bemNaming.delims.mod.val);
  });
});
