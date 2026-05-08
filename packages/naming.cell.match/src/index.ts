import { BemCell } from '@bem/sdk.cell';
import { bemNamingEntityParse } from '@bem/sdk.naming.entity.parse';
import { patternParser } from '@bem/sdk.naming.cell.pattern-parser';
import type { BemEntityName } from '@bem/sdk.entity-name';
import type { NamingConvention } from '@bem/sdk.naming.presets';

export interface MatchFsConvention extends Partial<NamingConvention['fs']> {
  pattern: string;
  scheme?: 'flat' | 'mixed' | 'nested';
  defaultLayer?: string;
  delims?: { elem?: string; mod?: string };
}

export interface MatchConvention {
  fs: MatchFsConvention;
  delims?: NamingConvention['delims'];
  wordPattern?: string;
}

export interface MatchResult {
  cell: BemCell | null;
  isMatch: boolean;
  rest: string | null;
}

export type Match = (relPath: string) => MatchResult;

interface ParsedPath {
  layer?: string;
  entity?: BemEntityName;
  tech?: string;
  rest?: string;
  dir?: string;
}

interface RawParsed {
  [key: string]: string | BemEntityName | undefined;
  layer?: string;
  entity?: BemEntityName | string;
  tech?: string;
  rest?: string;
  dir?: string;
}

type SchemeBuilder = (ctx: {
  wp: string;
  delims: { elem: string; mod: string };
}) => [string, string, (entity: BemEntityName, ctx: { dir: string }) => boolean];

const ALPHANUM_RE = '[A-Za-z][\\w\\-]*';
const resc = (s: string): string =>
  String(s).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');

const SCHEMES: Record<string, SchemeBuilder> = {
  flat: () => [
    `(?:()(${ALPHANUM_RE})`,
    ')?',
    () => true, // No way to check trash files in root. They all are just fine.
  ],
  mixed: ({ wp }) => [
    `(?:(${wp})(?:/(${ALPHANUM_RE})`,
    ')?)?',
    (entity, { dir }) => entity.block === dir,
  ],
  nested: ({ wp, delims: { elem, mod } }) => [
    `(?:(${wp}(?:/${elem}${wp})?(?:/${mod}${wp})?)(?:/(${ALPHANUM_RE})`,
    ')?)?',
    (entity, { dir }) => {
      const parts = dir.split('/');
      let i = 1;
      return (
        entity.block === parts[0] &&
        (!entity.elem || parts[i++] === elem + entity.elem) &&
        (!entity.mod || parts[i++] === mod + entity.mod.name)
      );
    },
  ],
};

interface PreparedPattern {
  regexp: RegExp;
  keys: string[];
  isValid: (entity: BemEntityName, ctx: { dir: string }) => boolean;
}

function preparePattern(conv: MatchConvention): PreparedPattern {
  const fs = conv.fs;
  const scheme = (fs.scheme ?? 'nested') as keyof typeof SCHEMES;
  if (!SCHEMES[scheme]) {
    throw new Error('fs.scheme should be "nested", "mixed" or "flat".');
  }

  const wordPattern = conv.wordPattern ?? ALPHANUM_RE;
  const patternTree = patternParser(fs.pattern);

  const fsDelims = fs.delims ?? {};
  const convDelims = conv.delims;
  const elemDelim =
    'elem' in fsDelims && fsDelims.elem !== undefined
      ? fsDelims.elem
      : (convDelims?.elem ?? '__');
  const modDelimRaw = convDelims?.mod;
  const modDelim =
    'mod' in fsDelims && fsDelims.mod !== undefined
      ? fsDelims.mod
      : typeof modDelimRaw === 'object' && modDelimRaw
        ? modDelimRaw.name
        : typeof modDelimRaw === 'string'
          ? modDelimRaw
          : '_';

  const [entityReStart, entityReEnd, isValid] = SCHEMES[scheme]({
    wp: wordPattern,
    delims: { elem: elemDelim, mod: modDelim },
  });

  const regexpChunks: string[] = [];
  const keys: string[] = [];
  const res: string[] = [];

  const diveIntoPattern = (parts: ReturnType<typeof patternParser>, j: number): void => {
    for (let i = 0; i < parts.length - j; i += 1) {
      const el = parts[i + j];
      if (i % 2 === 0) {
        const subParts = String(el).split('/');
        res.push(subParts.map((part) => resc(part)).join('(?:/'));
        regexpChunks.unshift(
          ...Array.from({ length: subParts.length - 1 }, () => ')?'),
        );
      } else if (Array.isArray(el)) {
        res.push('(?:');
        diveIntoPattern(el, 1);
        res.push(')?');
      } else if (el === 'entity') {
        keys.push('dir', el);
        res.push(entityReStart);
        regexpChunks.unshift(entityReEnd);
      } else {
        keys.push(el as string);
        res.push(
          el === 'tech'
            ? `(${wordPattern}(?:\\.(?:${wordPattern})+)*)`
            : `(${wordPattern})`,
        );
      }
    }
  };
  diveIntoPattern(patternTree, 0);

  const regexp = new RegExp('^' + res.concat(regexpChunks).join('') + '(.*)$');
  keys.push('rest');

  return { regexp, keys, isValid };
}

function buildPathParseMethod(
  conv: MatchConvention,
): (relPath: string) => ParsedPath | null {
  if (!conv.delims || !conv.wordPattern) {
    throw new Error(
      '@bem/sdk.naming.cell.match: convention must include `delims` and `wordPattern`',
    );
  }
  const entityParse = bemNamingEntityParse({
    delims: conv.delims,
    wordPattern: conv.wordPattern,
  });
  const { regexp, keys, isValid } = preparePattern(conv);

  return (relPath: string): ParsedPath | null => {
    const res = relPath.match(regexp);
    if (!res) return null;

    const obj: RawParsed = {};
    keys.forEach((key, i) => {
      const val = res[i + 1];
      if (val !== undefined) obj[key] = val;
    });

    if (!obj.entity && obj.rest) return null;

    const entity =
      typeof obj.entity === 'string' ? entityParse(obj.entity) : undefined;
    if (entity && !isValid(entity, { dir: String(obj.dir ?? '') })) {
      return null;
    }

    return {
      ...(obj.layer !== undefined ? { layer: String(obj.layer) } : {}),
      ...(entity ? { entity } : {}),
      ...(obj.tech !== undefined ? { tech: String(obj.tech) } : {}),
      ...(obj.rest !== undefined ? { rest: String(obj.rest) } : {}),
      ...(obj.dir !== undefined ? { dir: String(obj.dir) } : {}),
    };
  };
}

/**
 * Builds a function that matches a relative path against a naming convention
 * and returns a `BemCell` (when the path is a fully qualified entity), or just
 * an indication that the path is a partial match for the convention root.
 */
export function bemNamingCellMatch(conv: MatchConvention): Match {
  if (!conv?.fs || typeof conv.fs.pattern !== 'string') {
    throw new Error(
      '@bem/sdk.naming.cell.match: fs.pattern field required in convention',
    );
  }

  const layer = conv.fs.defaultLayer ?? 'common';
  let parse = buildPathParseMethod(conv);

  // Special crunch for nested scheme and empty elem.
  if (conv.fs.delims && conv.fs.delims.elem === '') {
    const parse1 = parse;
    const parse2 = buildPathParseMethod({
      ...conv,
      fs: { ...conv.fs, delims: { ...conv.fs.delims, elem: '💩' } },
    });
    parse = (relPath: string) => parse1(relPath) || parse2(relPath);
  }

  return (relPath: string): MatchResult => {
    const parsed = parse(relPath);
    const res: MatchResult = { cell: null, isMatch: false, rest: null };
    if (!parsed) return res;

    if (parsed.entity) {
      res.cell = BemCell.create({
        layer: parsed.layer ?? layer,
        ...(parsed.tech !== undefined ? { tech: parsed.tech } : {}),
        entity: parsed.entity,
      });
    }

    res.isMatch = !parsed.rest;
    res.rest = parsed.rest || null;

    return res;
  };
}

export default bemNamingCellMatch;
