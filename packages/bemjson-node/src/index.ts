import assert from 'node:assert';
import { inspect, type InspectOptionsStylized } from 'node:util';

export type ModifierValue = string | number | boolean | null | undefined;
export type Modifiers = Record<string, ModifierValue>;

export interface BemjsonNodeOptions {
  block: string;
  elem?: string;
  mods?: Modifiers | null;
  elemMods?: Modifiers | null;
  mix?: BemjsonNodeMix | BemjsonNodeMix[];
}

export type BemjsonNodeMix = BemjsonNode | BemjsonNodeOptions | string;

export interface BemjsonNodeRepresentation {
  block: string;
  mods: Modifiers;
  elem?: string;
  elemMods?: Modifiers;
  mix?: BemjsonNodeRepresentation[];
}

interface BemjsonNodeData {
  block: string;
  elem: string | null;
  mods: Modifiers;
  elemMods: Modifiers | null;
  mix: BemjsonNode[];
}

export class BemjsonNode {
  private readonly data: BemjsonNodeData;

  /** Brand for `isBemjsonNode` runtime checks across realms / older bundlers. */
  readonly __isBemjsonNode__ = true;

  constructor(obj: BemjsonNodeOptions) {
    assert(
      obj.block && typeof obj.block === 'string',
      '@bem/sdk.bemjson-node: `block` field should be a non empty string',
    );
    assert(
      !obj.elem || (obj.elem && typeof obj.elem === 'string'),
      '@bem/sdk.bemjson-node: `elem` field should be a non-empty string.',
    );
    assert(
      !obj.elemMods || (obj.elem && obj.elemMods),
      '@bem/sdk.bemjson-node: `elemMods` field should not be used without `elem` field.',
    );
    assert(
      !obj.mods || typeof obj.mods === 'object',
      '@bem/sdk.bemjson-node: `mods` field should be a simple object or null.',
    );
    assert(
      !obj.elemMods || typeof obj.elemMods === 'object',
      '@bem/sdk.bemjson-node: `elemMods` field should be a simple object or null.',
    );

    const data: BemjsonNodeData = {
      block: obj.block,
      elem: null,
      mods: {},
      elemMods: null,
      mix: [],
    };

    if (obj.elem) {
      data.elem = obj.elem;
      data.elemMods = {};
    }

    if (obj.mods) Object.assign(data.mods, obj.mods);
    if (obj.elemMods && data.elemMods) Object.assign(data.elemMods, obj.elemMods);

    if (obj.mix !== undefined) {
      const mixArr = Array.isArray(obj.mix) ? obj.mix : [obj.mix];
      data.mix = mixArr.map((n) =>
        BemjsonNode.isBemjsonNode(n)
          ? n
          : new BemjsonNode(typeof n === 'object' ? n : { block: n }),
      );
    }

    this.data = data;
  }

  /** Block name. */
  get block(): string {
    return this.data.block;
  }

  /** Element name, or `null` for non-element nodes. */
  get elem(): string | null {
    return this.data.elem;
  }

  /** Block-level modifier map. */
  get mods(): Modifiers {
    return this.data.mods;
  }

  /** Element-level modifier map, or `null` if there is no element. */
  get elemMods(): Modifiers | null {
    return this.data.elemMods;
  }

  /** Mixed-in nodes. */
  get mix(): BemjsonNode[] {
    return this.data.mix;
  }

  /** Plain-object representation of the node. */
  valueOf(): BemjsonNodeRepresentation {
    const d = this.data;
    const res: BemjsonNodeRepresentation = {
      block: d.block,
      mods: { ...d.mods },
    };

    if (d.elem) {
      res.elem = d.elem;
      res.elemMods = { ...(d.elemMods ?? {}) };
    }

    if (d.mix.length) res.mix = d.mix.map((n) => n.valueOf());

    return res;
  }

  /** JSON.stringify hook. */
  toJSON(): BemjsonNodeRepresentation {
    return this.valueOf();
  }

  /**
   * Compact debug-style string representation. Note: does not produce a
   * naming-convention-aware output — use `@bem/sdk.naming.*` for that.
   */
  toString(): string {
    const d = this.data;
    const formatMods = (a: Modifiers): string => {
      const pairs = Object.keys(a).map((k) =>
        a[k] === true ? [k] : [k, String(a[k] ?? '')],
      );
      return !pairs.length
        ? ''
        : ' ' + pairs.map((pair) => '_' + pair.join('_')).join(' ');
    };

    return (
      d.block +
      formatMods(d.mods) +
      (!d.elem
        ? ''
        : ' ' + d.block + '__' + d.elem + formatMods(d.elemMods ?? {})) +
      (!d.mix.length ? '' : '  ' + d.mix.join('  '))
    );
  }

  /** node:util custom inspect. */
  [inspect.custom](_depth: number, options: InspectOptionsStylized): string {
    return `BemjsonNode ${inspect(this.data, options)}`;
  }

  /** Type guard for `BemjsonNode` instances across realms. */
  static isBemjsonNode(value: unknown): value is BemjsonNode {
    return Boolean(
      value && typeof value === 'object' && (value as BemjsonNode).__isBemjsonNode__,
    );
  }
}

export default BemjsonNode;
