export interface BemEntityMod {
  name: string;
  val?: string | number | boolean;
}

export interface BemCell {
  block?: string;
  elem?: string;
  mod?: BemEntityMod;
  tech?: string;
}

const tmpl = {
  b: (b: string | undefined): string => (b ? `b:${b}` : ''),
  e: (e: string | undefined): string => (e ? ` e:${e}` : ''),
  m: (m: Record<string, string[]>): string =>
    Object.keys(m)
      .map((name) => `${tmpl.mn(name)}${tmpl.mv(m[name]!)}`)
      .join(''),
  mn: (name: string): string => ` m:${name}`,
  mv: (vals: string[]): string => (vals.length ? `=${vals.join('|')}` : ''),
  t: (t: string | undefined): string => (t ? ` t:${t}` : ''),
};

function cellKey(cell: BemCell): string {
  let out = '';
  if (cell.block) out += `b:${cell.block}`;
  if (cell.elem) out += ` e:${cell.elem}`;
  if (cell.mod) {
    out += ` m:${cell.mod.name}`;
    const v = cell.mod.val;
    if (v !== undefined && v !== '' && typeof v !== 'boolean') {
      out += `=${String(v)}`;
    }
  }
  if (cell.tech) out += ` t:${cell.tech}`;
  return out;
}

/**
 * Insertion-ordered set of BEM cells with custom hashing. Mirrors the legacy
 * `hash-set`-based behaviour: only the key is computed at insert time, so
 * subsequent mutation of the stored reference does not change membership.
 */
class BemCellSet {
  private readonly map = new Map<string, BemCell>();

  add(cell: BemCell): this {
    const key = cellKey(cell);
    if (!this.map.has(key)) this.map.set(key, cell);
    return this;
  }

  forEach(fn: (cell: BemCell) => void): void {
    for (const cell of this.map.values()) fn(cell);
  }

  get size(): number {
    return this.map.size;
  }

  toArray(): BemCell[] {
    return Array.from(this.map.values());
  }
}

export interface ParseScope {
  block?: string;
  elem?: string;
}

/**
 * Parse import statement and extract BEM entities.
 *
 * @example
 * const entity = parse('b:button e:text')[0];
 * entity.block; // 'button'
 * entity.elem;  // 'text'
 */
export function parse(importString: string, scope?: ParseScope): BemCell[] {
  const main: BemCell = {};
  const ctx: ParseScope = scope ?? {};
  const acc = new BemCellSet();

  for (const importToken of importString.split(' ')) {
    const split = importToken.split(':');
    const type = split[0];
    const tail = split[1];

    if (type === 'b' && tail !== undefined) {
      main.block = tail;
      acc.add(main);
    } else if (type === 'e' && tail !== undefined) {
      main.elem = tail;
      if (!main.block && ctx.elem !== tail) {
        main.block = ctx.block;
        acc.add(main);
      }
    } else if ((type === 'm' || type === 't') && tail !== undefined) {
      if (!main.block) {
        main.block = ctx.block;
        if (!main.elem && ctx.elem) main.elem = ctx.elem;
        acc.add(main);
      }

      if (type === 'm') {
        const splitMod = tail.split('=');
        const modName = splitMod[0]!;
        const modVals = splitMod[1];

        acc.add({ ...main, mod: { name: modName } });

        if (modVals) {
          for (const modVal of modVals.split('|')) {
            acc.add({ ...main, mod: { name: modName, val: modVal } });
          }
        }
      } else {
        if (acc.size === 0) acc.add(main);
        acc.forEach((entity) => {
          entity.tech = tail;
        });
      }
    }
  }

  return acc.toArray();
}

interface MergedAcc {
  b?: string;
  e?: string;
  m: Record<string, string[]>;
  t?: string;
}

/**
 * Create import string notation of passed BEM cells.
 *
 * @example
 * stringify([{ block: 'button' }, { block: 'button', mod: { name: 'theme', val: 'normal' } }]);
 * // 'b:button m:theme=normal'
 */
export function stringify(cells: BemCell | BemCell[]): string {
  const arr = Array.isArray(cells) ? cells : [cells];

  const merged = arr.reduce<MergedAcc>(
    (acc, cell) => {
      if (cell.block) acc.b = cell.block;
      if (cell.elem) acc.e = cell.elem;
      if (cell.mod) {
        const list = acc.m[cell.mod.name] ?? (acc.m[cell.mod.name] = []);
        const { val } = cell.mod;
        if (val && typeof val !== 'boolean') {
          const stringVal = String(val);
          if (!list.includes(stringVal)) list.push(stringVal);
        }
      }
      if (cell.tech) acc.t = cell.tech;
      return acc;
    },
    { m: {} },
  );

  return `${tmpl.b(merged.b)}${tmpl.e(merged.e)}${tmpl.m(merged.m)}${tmpl.t(merged.t)}`;
}

/**
 * Build the full form of an import notation string, expanding any bare
 * tokens (`m:`, `e:`, `t:`) against the given scope (closes #275).
 *
 * Equivalent to `stringify(parse(importString, scope))`, but exposed as a
 * named helper for downstream consumers (e.g. webpack-bem-plugin) that
 * need a single round-trip from a short, context-dependent notation to
 * its self-contained canonical form.
 *
 * @example
 *   stringifyFull('m:theme=normal', { block: 'button' });
 *   // → 'b:button m:theme=normal'
 *
 *   stringifyFull('e:text m:pseudo', { block: 'button2' });
 *   // → 'b:button2 e:text m:pseudo'
 */
export function stringifyFull(
  importString: string,
  scope?: ParseScope,
): string {
  return stringify(parse(importString, scope));
}
