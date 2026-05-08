import { expect } from 'chai';

import { BemCell } from '@bem/sdk.cell';
import { legacy, origin, react } from '@bem/sdk.naming.presets';

import { bemNamingCellMatch, type MatchResult } from './index.js';

const flatLegacyMatch = bemNamingCellMatch({
  ...legacy,
  fs: {
    ...legacy.fs,
    scheme: 'flat',
    // Legacy used to have a flat pattern by default. After migration legacy is
    // an alias of origin, so we set the flat pattern explicitly to keep the
    // historical scenario covered.
    pattern: '${entity}${layer?@${layer}}.${tech}',
  },
});
const flatOriginMatch = bemNamingCellMatch({
  ...origin,
  fs: { ...origin.fs, scheme: 'flat' },
});
const mixedOriginMatch = bemNamingCellMatch({
  ...origin,
  fs: { ...origin.fs, scheme: 'mixed' },
});
const originMatch = bemNamingCellMatch(origin);
const mixedModernMatch = bemNamingCellMatch({
  ...origin,
  fs: {
    ...origin.fs,
    scheme: 'mixed',
    pattern: '${entity}${layer?@${layer}}.${tech}',
  },
});
const nestedModernMatch = bemNamingCellMatch({
  ...origin,
  fs: {
    ...origin.fs,
    scheme: 'nested',
    pattern: '${entity}${layer?@${layer}}.${tech}',
  },
});
const nestedModernEmptyElemMatch = bemNamingCellMatch({
  ...react,
  fs: {
    ...react.fs,
    scheme: 'nested',
    pattern: '${entity}${layer?@${layer}}.${tech}',
  },
});

interface ExpectedSerialized {
  cell: string | null;
  isMatch: boolean;
  rest: string | null;
}

type Case = [title: string, relPath: string, expected: ExpectedSerialized];

interface CellExpect {
  layer?: string;
  block?: string;
  elem?: string;
  mod?: string | { name: string; val?: string | true };
  val?: string | true;
  tech?: string;
}

interface RawExpect {
  cell?: CellExpect | null;
  isMatch?: boolean;
  rest?: string | null;
}

function evalLiteral(src: string): RawExpect {
   
  return new Function(`return (${src});`)() as RawExpect;
}

function rawses(strings: TemplateStringsArray): Case[] {
  const tpl = strings[0]!.replace(/\n+/g, '\n');
  const lines = tpl
    .replace(/^\n/, '')
    .replace(/\n\s*$/, '')
    .split('\n');
  const indents = lines
    .filter((l) => l.trim())
    .map((l) => l.match(/ */)![0].length);
  const minIndent = Math.min(...indents);

  return lines.map((line) => {
    const [titleRaw, relPath, rawExpected] = line
      .slice(minIndent)
      .split('→')
      .map((s) => s.trim());
    const parsed = evalLiteral(rawExpected!);
    const expected: ExpectedSerialized = {
      cell: null,
      isMatch: false,
      rest: null,
    };
    if (parsed.cell) {
      expected.cell = BemCell.create(parsed.cell as never).id;
    }
    expected.isMatch =
      parsed.isMatch === false
        ? false
        : Boolean(parsed.isMatch || expected.cell);
    expected.rest = parsed.rest ?? null;

    return [titleRaw!, relPath!, expected];
  });
}

function simplifyResult(res: MatchResult): ExpectedSerialized {
  return {
    cell: res.cell ? res.cell.id : null,
    isMatch: res.isMatch,
    rest: res.rest,
  };
}

const groups: Array<[string, ReturnType<typeof bemNamingCellMatch>, Case[]]> = [
  [
    'flat / legacy',
    flatLegacyMatch,
    rawses`
      reject invalid                 → blocks           → { isMatch: false }
      reject invalid block: _bb      → _bb              → { isMatch: false }
      reject invalid block: .bb      → .bb              → { isMatch: false }
      reject nested scheme           → bb/_mod          → { isMatch: false }
      reject flat scheme             → bb/bb.css        → { isMatch: false }
      reject block without tech      → bb               → { isMatch: false }
      parse fully qualified tech     → bb.css           → { cell: { layer: 'common', block: 'bb', tech: 'css' } }
      parse fully … complex tech     → bb.t1.t2         → { cell: { layer: 'common', block: 'bb', tech: 't1.t2' } }

      parse full path to block       → bb.t             → { cell: { layer: 'common', block: 'bb', tech: 't' } }
      parse full path to block mod   → bb_m.t           → { cell: { layer: 'common', block: 'bb', mod: 'm', tech: 't' } }
      parse full path to block mod2  → bb_m_v.t         → { cell: { layer: 'common', block: 'bb', mod: 'm', val: 'v', tech: 't' } }
      parse full path to elem        → bb__e.t          → { cell: { layer: 'common', block: 'bb', elem: 'e', tech: 't' } }
      parse full path to elem mod    → bb__e_m.t        → { cell: { layer: 'common', block: 'bb', elem: 'e', mod: 'm', tech: 't' } }
      parse full path to elem mod2   → bb__e_m_v.t      → { cell: { layer: 'common', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' } }

      find & reject file elem        → bb__e.t/x.y      → { cell: { layer: 'common', block: 'bb', elem: 'e', tech: 't' }, isMatch: false, rest: '/x.y' }
      find & reject file block mod2  → bb_m_v.t/x.y     → { cell: { layer: 'common', block: 'bb', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
      find & reject file elem mod2   → bb__e_m_v.t/x.y  → { cell: { layer: 'common', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
    `,
  ],
  [
    'flat / origin',
    flatOriginMatch,
    rawses`
      reject invalid block: _bb      → common.blocks/_bb          → { isMatch: false }
      reject invalid block: .bb      → common.blocks/.bb          → { isMatch: false }
      reject nested scheme           → common.blocks/bb/_mod      → { isMatch: false }
      reject flat scheme             → common.blocks/bb/bb.css    → { isMatch: false }
      reject block without tech      → common.blocks/bb           → { isMatch: false }
      match partial layer            → blocks                     → { isMatch: true }
      match partial layer            → common.blocks              → { isMatch: true }
      parse fully qualified tech     → common.blocks/bb.css       → { cell: { layer: 'common', block: 'bb', tech: 'css' } }

      parse full path to block       → dd.blocks/bb.t             → { cell: { layer: 'dd', block: 'bb', tech: 't' } }
      parse full path to block mod   → dd.blocks/bb_m.t           → { cell: { layer: 'dd', block: 'bb', mod: 'm', tech: 't' } }
      parse full path to block mod2  → dd.blocks/bb_m_v.t         → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' } }
      parse full path to elem        → dd.blocks/bb__e.t          → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' } }
      parse full path to elem mod    → dd.blocks/bb__e_m.t        → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', tech: 't' } }
      parse full path to elem mod2   → dd.blocks/bb__e_m_v.t      → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' } }

      find & reject file elem        → dd.blocks/bb__e.t/x.y      → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' }, isMatch: false, rest: '/x.y' }
      find & reject file block mod2  → dd.blocks/bb_m_v.t/x.y     → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
      find & reject file elem mod2   → dd.blocks/bb__e_m_v.t/x.y  → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
    `,
  ],
  [
    'mixed / origin',
    mixedOriginMatch,
    rawses`
      reject invalid block: _block   → common.blocks/_button         → { isMatch: false }
      reject invalid block: .button  → common.blocks/.button         → { isMatch: false }
      reject nested scheme           → common.blocks/button/_mod     → { isMatch: false }
      reject block without tech      → common.blocks/button/button   → { isMatch: false }
      match valid block: button      → common.blocks/button          → { isMatch: true }
      match partial layer            → blocks                        → { isMatch: true }
      match partial layer            → common.blocks                 → { isMatch: true }
      parse fully qualified tech     → common.blocks/bb/bb.css       → { cell: { layer: 'common', block: 'bb', tech: 'css' } }

      parse full path to block       → dd.blocks/bb/bb.t             → { cell: { layer: 'dd', block: 'bb', tech: 't' } }
      parse full path to block mod   → dd.blocks/bb/bb_m.t           → { cell: { layer: 'dd', block: 'bb', mod: 'm', tech: 't' } }
      parse full path to block mod2  → dd.blocks/bb/bb_m_v.t         → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' } }
      parse full path to elem        → dd.blocks/bb/bb__e.t          → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' } }
      parse full path to elem mod    → dd.blocks/bb/bb__e_m.t        → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', tech: 't' } }
      parse full path to elem mod2   → dd.blocks/bb/bb__e_m_v.t      → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' } }

      rejects alien block            → dd.blocks/qq/bb.t             → { isMatch: false }
      rejects alien block mod        → dd.blocks/qq/bb_m.t           → { isMatch: false }
      rejects alien block mod2       → dd.blocks/qq/bb_m_v.t         → { isMatch: false }
      rejects alien elem             → dd.blocks/qq/bb__e.t          → { isMatch: false }
      rejects alien elem mod         → dd.blocks/qq/bb__e_m.t        → { isMatch: false }
      rejects alien elem mod2        → dd.blocks/qq/bb__e_m_v.t      → { isMatch: false }

      find & reject file elem        → dd.blocks/bb/bb__e.t/x.y      → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' }, isMatch: false, rest: '/x.y' }
      find & reject file block mod2  → dd.blocks/bb/bb_m_v.t/x.y     → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
      find & reject file elem mod2   → dd.blocks/bb/bb__e_m_v.t/x.y  → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
    `,
  ],
  [
    'nested / origin',
    originMatch,
    rawses`
      reject invalid block: _button  → common.blocks/_button           → { isMatch: false }
      reject invalid block: .button  → common.blocks/.button           → { isMatch: false }
      reject blocks inside block     → common.blocks/button/button     → { isMatch: false }
      match partial layer            → blocks                          → { isMatch: true }
      match partial layer            → common.blocks                   → { isMatch: true }
      match valid block              → common.blocks/button            → { isMatch: true }
      match valid mod inside button  → common.blocks/button/_mod       → { isMatch: true }
      parse full valid path to block → common.blocks/button/button.css → { cell: { layer: 'common', block: 'button', tech: 'css' } }
      parse full valid path to mod2  → common.blocks/b/_m/b_m_v.t      → { cell: { layer: 'common', block: 'b', mod: 'm', val: 'v', tech: 't' } }

      parse full path to block       → dd.blocks/bb/bb.t               → { cell: { layer: 'dd', block: 'bb', tech: 't' } }
      parse full path to block mod   → dd.blocks/bb/_m/bb_m.t          → { cell: { layer: 'dd', block: 'bb', mod: 'm', tech: 't' } }
      parse full path to block mod2  → dd.blocks/bb/_m/bb_m_v.t        → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' } }
      parse full path to elem        → dd.blocks/bb/__e/bb__e.t        → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' } }
      parse full path to elem mod    → dd.blocks/bb/__e/_m/bb__e_m.t   → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', tech: 't' } }
      parse full path to elem mod2   → dd.blocks/bb/__e/_m/bb__e_m_v.t → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' } }

      rejects alien block            → dd.blocks/qq/bb.t               → { isMatch: false }
      rejects alien block mod        → dd.blocks/qq/_m/bb_m.t          → { isMatch: false }
      rejects alien block mod2       → dd.blocks/qq/_m/bb_m_v.t        → { isMatch: false }
      rejects alien block elem       → dd.blocks/qq/__e/bb__e.t        → { isMatch: false }
      rejects alien block elem mod   → dd.blocks/qq/__e/_m/bb__e_m.t   → { isMatch: false }
      rejects alien block elem mod2  → dd.blocks/qq/__e/_m/bb__e_m_v.t → { isMatch: false }
      rejects alien elem             → dd.blocks/bb/__f/bb__e.t        → { isMatch: false }
      rejects alien elem mod         → dd.blocks/bb/__f/_m/bb__e_m.t   → { isMatch: false }
      rejects alien elem mod2        → dd.blocks/bb/__f/_m/bb__e_m_v.t → { isMatch: false }
      rejects alien mod              → dd.blocks/bb/_n/bb_m.t          → { isMatch: false }
      rejects alien mod2             → dd.blocks/bb/_n/bb_m_v.t        → { isMatch: false }
      rejects alien mod in elem      → dd.blocks/bb/__e/_n/bb__e_m.t   → { isMatch: false }
      rejects alien mod2 in elem     → dd.blocks/bb/__e/_n/bb__e_m_v.t → { isMatch: false }

      find & reject file elem        → dd.blocks/bb/__e/bb__e.t/x.y        → { cell: { layer: 'dd', block: 'bb', elem: 'e', tech: 't' }, isMatch: false, rest: '/x.y' }
      find & reject file block mod2  → dd.blocks/bb/_m/bb_m_v.t/x.y        → { cell: { layer: 'dd', block: 'bb', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
      find & reject file elem mod2   → dd.blocks/bb/__e/_m/bb__e_m_v.t/x.y → { cell: { layer: 'dd', block: 'bb', elem: 'e', mod: 'm', val: 'v', tech: 't' }, isMatch: false, rest: '/x.y' }
    `,
  ],
  [
    'mixed / modern',
    mixedModernMatch,
    rawses`
      reject invalid block           → .blocks                → { cell: null, isMatch: false }
      reject typical path for layer  → common.blocks          → { cell: null, isMatch: false }
      reject nested block path       → blocks/button          → { cell: null, isMatch: false }
      reject invalid block: _button  → button/_button         → { cell: null, isMatch: false }
      reject nested scheme mod       → button/_mod            → { cell: null, isMatch: false }
      reject invalid block           → button/button          → { cell: null, isMatch: false }
      match partial block path       → blocks                 → { cell: null, isMatch: true }
      parse typical block path       → blocks/blocks.css      → { cell: { layer: 'common', block: 'blocks', tech: 'css' } }
      parse typical block in layer   → blocks/blocks@ios.css  → { cell: { layer: 'ios', block: 'blocks', tech: 'css' } }
      parse typical mod path         → button/button_mod.css  → { cell: { layer: 'common', block: 'button', mod: 'mod', tech: 'css' } }
    `,
  ],
  [
    'nested / modern',
    nestedModernMatch,
    rawses`
      reject invalid block           → .blocks                → { cell: null, isMatch: false }
      reject typical path for layer  → common.blocks          → { cell: null, isMatch: false }
      reject nested block path       → blocks/button          → { cell: null, isMatch: false }
      reject invalid block           → button/button          → { cell: null, isMatch: false }
      match partial block path       → blocks                 → { cell: null, isMatch: true }
      match partial mod path: _btn   → btn/_btn               → { cell: null, isMatch: true }
      parse typical block path       → blocks/blocks.css      → { cell: { layer: 'common', block: 'blocks', tech: 'css' } }
      parse typical block in layer   → blocks/blocks@ios.css  → { cell: { layer: 'ios', block: 'blocks', tech: 'css' } }
      parse typical mod path         → button/_mod/button_mod.css  → { cell: { layer: 'common', block: 'button', mod: 'mod', tech: 'css' } }
    `,
  ],
  [
    'nested / modern + react',
    nestedModernEmptyElemMatch,
    rawses`
      reject invalid block           → .blocks                → { cell: null, isMatch: false }
      reject typical path for layer  → common.blocks          → { cell: null, isMatch: false }
      match partial block path       → bb                     → { cell: null, isMatch: true }
      match partial mod path: _mm    → bb/_mm                 → { cell: null, isMatch: true }
      parse typical block path       → bb/bb.css              → { cell: { layer: 'common', block: 'bb', tech: 'css' } }
      parse typical elem path        → bb/ee/bb-ee.css        → { cell: { layer: 'common', block: 'bb', elem: 'ee', tech: 'css' } }
      parse typical block in layer   → bb/bb@ios.css          → { cell: { layer: 'ios', block: 'bb', tech: 'css' } }
      parse typical mod path         → bb/_mod/bb_mod.css     → { cell: { layer: 'common', block: 'bb', mod: 'mod', tech: 'css' } }
      parse hyphenated layer (#385)  → MyBlock/_kind/MyBlock_kind@touch-phone.js → { cell: { layer: 'touch-phone', block: 'MyBlock', mod: 'kind', tech: 'js' } }
    `,
  ],
];

describe('naming.cell.match', () => {
  for (const [groupTitle, match, cases] of groups) {
    describe(groupTitle, () => {
      for (const [title, relPath, expected] of cases) {
        it(title, () => {
          expect(simplifyResult(match(relPath))).to.eql(expected);
        });
      }
    });
  }
});
