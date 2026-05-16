export interface NamingDelims {
  elem: string;
  mod: { name: string; val: string };
}

export interface NamingConvention {
  delims: NamingDelims;
}

export interface EntityLike {
  block: string;
  elem?: string;
  mod?: string | { name: string; val?: string | boolean };
}

export type Stringify = (entity: EntityLike | null | undefined) => string;

export function stringify(
  entity: EntityLike | null | undefined,
  delims: NamingDelims,
): string {
  if (!entity || !entity.block) {
    return '';
  }

  const out: string[] = [entity.block];

  if (entity.elem !== undefined) {
    out.push(delims.elem, entity.elem);
  }

  const mod = entity.mod;
  if (mod !== undefined) {
    if (typeof mod === 'string') {
      out.push(delims.mod.name, mod);
    } else {
      const { name, val } = mod;
      const hasVal = 'val' in mod;
      if (val || !hasVal) {
        out.push(delims.mod.name, name);
        if (val && val !== true) {
          out.push(delims.mod.val, val);
        }
      }
    }
  }

  return out.join('');
}

export function stringifyWrapper(convention: NamingConvention): Stringify {
  return (entity) => stringify(entity, convention.delims);
}

export default stringifyWrapper;
