/**
 * Stringifies any value into a JS literal-ish snippet for embedding into JSX
 * attribute braces. Mirrors the legacy semantics: strings are quoted with
 * single quotes, objects use space-padded `{ 'k': v }` formatting, arrays
 * use `[v, v]`, primitives are left as-is.
 */
export function valToStr(val: unknown): string {
  switch (typeof val) {
    case 'string':
      return `'${val}'`;
    case 'object':
      if (val === null) return 'null';
      if (Array.isArray(val)) return arrToStr(val);
      return objToStr(val as Record<string, unknown>);
    default:
      return String(val);
  }
}

export function arrToStr(arr: readonly unknown[]): string {
  return `[${arr.map((e) => valToStr(e)).join(', ')}]`;
}

function propToStr(key: string, val: unknown): string {
  return `'${key}': ${valToStr(val)}`;
}

export function objToStr(obj: Record<string, unknown>): string {
  const keys = Object.keys(obj);
  if (!keys.length) return '{}';
  return `{ ${keys.map((k) => propToStr(k, obj[k])).join(', ')} }`;
}

export type StyleObject = Record<string, string>;

/**
 * Parses inline `style="..."` strings into `{ prop: value }` objects.
 * If `style` is already an object, it is returned untouched.
 */
export function styleToObj(style: string | StyleObject): StyleObject {
  if (typeof style !== 'string') return style;

  return style.split(';').reduce<StyleObject>((acc, st) => {
    if (st.length) {
      const [prop, value] = st.split(':');
      if (prop !== undefined && value !== undefined) acc[prop] = value;
    }
    return acc;
  }, {});
}
