import { expect } from 'chai';

import { depsJsParser } from './deps-js-parser.js';
import type { FileWithData } from '../types.js';

interface VertexLike {
  entity: { id: string };
  tech?: string;
}

const key = (v: VertexLike): string =>
  `${v.entity.id}${v.tech ? '.' + v.tech : ''}`;

const parse = (records: unknown[]): string[] => {
  const res = depsJsParser(records as FileWithData[]);
  return res.map(
    (v) =>
      `${key(v.vertex as never)} ${v.ordered ? '=>' : '->'} ${key(v.dependOn as never)}`,
  );
};

describe('parser (deps.js)', () => {
  it('resolves empty', () => {
    expect(parse([{ entity: { block: 'be' } }])).to.deep.equal([]);
  });

  it('resolves block deps', () => {
    expect(
      parse([
        { entity: { block: 'be' }, data: [{ shouldDeps: { block: 'b1' } }] },
      ]),
    ).to.deep.equal(['be -> b1']);
  });

  it('resolves elems', () => {
    expect(
      parse([
        {
          entity: { block: 'be' },
          data: [{ shouldDeps: { elem: ['e1', 'e2'] } }],
        },
      ]),
    ).to.deep.equal(['be -> be__e1', 'be -> be__e2']);
  });

  it('resolves block with tech', () => {
    expect(
      parse([
        {
          entity: { block: 'be' },
          data: [
            {
              tech: 'js',
              shouldDeps: [{ tech: 'bemhtml', block: 'b1' }],
            },
          ],
        },
      ]),
    ).to.deep.equal(['be.js -> b1.bemhtml']);
  });

  it('unifies deps from several sources', () => {
    expect(
      parse([
        {
          entity: { block: 'b1' },
          data: [
            {
              shouldDeps: [
                { elems: ['e1', 'e2'] },
                { mods: { theme: 'normal' } },
              ],
            },
            {
              mustDeps: [{ block: 'i-bem', elem: ['dom'] }, { block: 'ua' }],
            },
          ],
        },
        {
          entity: { block: 'b2' },
          data: [
            {
              shouldDeps: { elem: 'e3' },
              mustDeps: { mods: { theme: 'islands' } },
            },
          ],
        },
      ]),
    ).to.deep.equal([
      'b1 => i-bem__dom',
      'b1 => ua',
      'b2 => b2_theme',
      'b2 => b2_theme_islands',
      'b1 -> b1__e1',
      'b1 -> b1__e2',
      'b1 -> b1_theme',
      'b1 -> b1_theme_normal',
      'b2 -> b2__e3',
    ]);
  });

  it('resolves cross-tech deps', () => {
    expect(
      parse([
        {
          entity: { block: 'be' },
          data: [
            {
              tech: 'tmpl-spec.js',
              shouldDeps: [
                { tech: 'bemhtml', elems: ['e1', 'e2'] },
                { tech: 'i18n', block: 'translations' },
              ],
            },
          ],
        },
      ]),
    ).to.deep.equal([
      'be.tmpl-spec.js -> be.bemhtml',
      'be.tmpl-spec.js -> be__e1.bemhtml',
      'be.tmpl-spec.js -> be__e2.bemhtml',
      'be.tmpl-spec.js -> translations.i18n',
    ]);
  });

  it('uses elem field as context', () => {
    expect(
      parse([
        {
          entity: { block: 'be' },
          data: [{ elem: 'ea', shouldDeps: [{ elem: 'e0' }] }],
        },
      ]),
    ).to.deep.equal(['be__ea -> be__e0']);
  });

  it('uses block field as context', () => {
    expect(
      parse([
        {
          entity: { block: 'be' },
          data: [{ block: 'ba', shouldDeps: [{ elem: 'e1' }] }],
        },
      ]),
    ).to.deep.equal(['ba -> ba__e1']);
  });

  it('uses block and elem fields as context', () => {
    expect(
      parse([
        {
          entity: { block: 'be' },
          data: [
            { block: 'ba', elem: 'ea', shouldDeps: [{ elem: 'e2' }] },
          ],
        },
      ]),
    ).to.deep.equal(['ba__ea -> ba__e2']);
  });

  it('resolves elems with noDeps', () => {
    expect(
      parse([
        {
          entity: { block: 'be' },
          data: [{ shouldDeps: { elem: 'e1' }, noDeps: { elem: 'e2' } }],
        },
      ]),
    ).to.deep.equal(['be -> be__e1']);
  });

  it('resolves elems with noDeps and removes if needed', () => {
    expect(
      parse([
        {
          entity: { block: 'be' },
          data: [
            { shouldDeps: { elem: ['e1', 'e2'] }, noDeps: { elem: 'e2' } },
          ],
        },
      ]),
    ).to.deep.equal(['be -> be__e1']);
  });
});
