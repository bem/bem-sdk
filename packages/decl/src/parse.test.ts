import { expect } from 'chai';

import type { BemCell } from '@bem/sdk.cell';

import { parse } from './parse.js';

const simplify = (cell: BemCell): { entity: { block: string; elem?: string }; tech: string | null } => {
  const entity: { block: string; elem?: string } = { block: cell.entity.block };
  if (cell.entity.elem) entity.elem = cell.entity.elem;
  return { entity, tech: cell.tech ?? null };
};

describe('parse', () => {
  it('throws on undefined', () => {
    expect(() => parse(undefined as unknown as string)).to.throw(
      /Bemdecl must be String or Object/,
    );
  });

  it('throws on unsupported (string)', () => {
    expect(() =>
      parse("({ format: 'unknown', components: [] })"),
    ).to.throw(/Unknown BEMDECL format/);
  });

  it('throws on unsupported (object)', () => {
    expect(() => parse({ format: 'unknown', components: [] })).to.throw(
      /Unknown BEMDECL format/,
    );
  });

  it('parses harmony decl from string', () => {
    expect(
      parse(
        "({ format: 'harmony', decl: [{ block: 'doesnt-matter', elems: ['elem'] }] })",
      ).map(simplify),
    ).to.deep.equal([
      { entity: { block: 'doesnt-matter' }, tech: null },
      { entity: { block: 'doesnt-matter', elem: 'elem' }, tech: null },
    ]);
  });

  it('parses harmony decl from object', () => {
    expect(
      parse({
        format: 'harmony',
        decl: [{ block: 'doesnt-matter', elems: ['elem'] }],
      }).map(simplify),
    ).to.deep.equal([
      { entity: { block: 'doesnt-matter' }, tech: null },
      { entity: { block: 'doesnt-matter', elem: 'elem' }, tech: null },
    ]);
  });
});
