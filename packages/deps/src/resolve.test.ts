import { expect } from 'chai';

import { resolve } from './resolve.js';

describe('resolve', () => {
  it('returns result containing entities and dependOn sections', () => {
    const r = resolve();
    expect(r).to.have.all.keys(['entities', 'dependOn']);
  });

  it('returns empty entities if no args passed', () => {
    expect(resolve().entities).to.be.empty;
  });

  it('returns empty dependOn if decl is empty', () => {
    expect(resolve().dependOn).to.be.empty;
  });

  it('returns empty dependOn for any decl if deps is empty', () => {
    expect(resolve([{ block: 'A' }]).dependOn).to.be.empty;
  });

  it('returns empty dependOn for any decl when no opts.tech', () => {
    const decl = [{ block: 'A' }];
    const deps = [
      {
        vertex: { entity: { block: 'A' } },
        dependOn: { entity: { block: 'B' } },
      },
    ];
    expect(resolve(decl, deps).dependOn).to.be.empty;
  });

  it('returns identical decl if no deps are specified', () => {
    const decl = [{ block: 'A' }];
    expect(resolve(decl).entities).to.deep.equal(decl);
  });

  it('accepts a single deps item as object', () => {
    const decl = [{ block: 'A' }];
    const dep = {
      vertex: { entity: { block: 'A' } },
      dependOn: { entity: { block: 'B' } },
    };
    expect(resolve(decl, [dep])).to.deep.equal(resolve(decl, dep));
  });

  it('returns dependOn entries grouped by foreign tech', () => {
    const decl = [{ block: 'A' }];
    const dep = {
      vertex: { entity: { block: 'A' }, tech: 'js' },
      dependOn: { entity: { block: 'B' }, tech: 'bemhtml.js' },
    };
    expect(resolve(decl, dep, { tech: 'js' })).to.deep.equal({
      entities: [{ block: 'A' }],
      dependOn: [
        { tech: 'bemhtml.js', entities: [{ block: 'B' }] },
      ],
    });
  });

  it('drops dependOn entries when tech does not match', () => {
    const decl = [{ block: 'A' }];
    const dep = {
      vertex: { entity: { block: 'A' }, tech: 'bemhtml.js' },
      dependOn: { entity: { block: 'B' }, tech: 'bemhtml.js' },
    };
    expect(resolve(decl, dep, { tech: 'bemjson.js' })).to.deep.equal({
      entities: [{ block: 'A' }],
      dependOn: [],
    });
  });

  it('returns identical decl for unspecified deps with tech', () => {
    const decl = [{ block: 'A' }];
    expect(resolve(decl, undefined, { tech: 'css' }).entities).to.deep.equal(
      decl,
    );
  });

  it('returns identical decl for empty deps with tech', () => {
    const decl = [{ block: 'A' }];
    expect(resolve(decl, [], { tech: 'css' }).entities).to.deep.equal(decl);
  });
});
