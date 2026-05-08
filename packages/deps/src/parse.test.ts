import { expect } from 'chai';

import { parse, parseSync } from './parse.js';
import type { FileWithData } from './types.js';

const sample: FileWithData = {
  // BemFile-like minimum — only `entity` and `data` are exercised by the parser.
  file: {} as never,
  entity: { block: 'a' } as never,
  data: [{ shouldDeps: { block: 'b' } }],
};

describe('parse / parseSync (#301)', () => {
  it('parseSync returns a synchronous array', () => {
    const links = parseSync()(sample);
    expect(Array.isArray(links)).to.equal(true);
    expect(links.length).to.be.greaterThan(0);
  });

  it('parse returns a Promise<DepsLink[]>', async () => {
    const out = parse()(sample);
    expect(out).to.be.instanceOf(Promise);
    const links = await out;
    expect(Array.isArray(links)).to.equal(true);
  });

  it('parseSync and parse yield the same DepsLink shape', async () => {
    const sync = parseSync()(sample);
    const async = await parse()(sample);
    expect(sync).to.deep.equal(async);
  });
});
