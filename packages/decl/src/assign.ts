import { BemCell } from '@bem/sdk.cell';

const isValidVal = (v: unknown): boolean => Boolean(v || v === 0);

interface CellLike {
  entity?: {
    block?: string | null;
    elem?: string;
    mod?: { name?: string; val?: unknown };
    valueOf?: () => unknown;
  };
  tech?: string | null;
}

/**
 * Fills entity fields with the scope ones.
 *
 * Mirrors legacy `decl/assign`: returns a fully-resolved `BemCell` by
 * combining the partial `cell.entity`/`cell.tech` with the scoping `BemCell`.
 */
export function assign(cell: CellLike, scope: BemCell): BemCell {
  if (!scope) {
    throw new Error('Scope parameter is a required one.');
  }
  const scopeOk =
    scope.constructor.name === 'BemCell' || (scope.entity && scope.entity.block);
  if (!scopeOk) {
    throw new Error('Scope parameter should be a BemCell-like object.');
  }

  const fEntity = (cell.entity ?? {}) as {
    block?: string | null;
    elem?: string;
    mod?: { name?: string; val?: unknown };
    valueOf?: () => unknown;
  };
  const sEntity = scope.entity;
  const result: { entity: Record<string, unknown>; tech: string | null } = {
    entity: {},
    tech: cell.tech ?? scope.tech ?? null,
  };

  const fKeys = Object.keys(cell);
  if (fKeys.length === 0 || (fKeys.length === 1 && cell.tech)) {
    result.entity = sEntity as unknown as Record<string, unknown>;
    return BemCell.create(result as unknown as Parameters<typeof BemCell.create>[0]);
  }

  if (fEntity.block) {
    Object.assign(
      result.entity,
      typeof fEntity.valueOf === 'function' ? (fEntity.valueOf() as object) : fEntity,
    );
    return BemCell.create(result as unknown as Parameters<typeof BemCell.create>[0]);
  }

  result.entity['block'] = fEntity.block || sEntity.block;

  if (fEntity.elem) {
    result.entity['elem'] = fEntity.elem;
    if (!fEntity.mod) {
      return BemCell.create(result as unknown as Parameters<typeof BemCell.create>[0]);
    }
  } else if (
    sEntity.elem &&
    ((fEntity.mod && (fEntity.mod.name || fEntity.mod.val)) || fEntity.block == null)
  ) {
    result.entity['elem'] = sEntity.elem;
  }

  if (fEntity.mod && fEntity.mod.name) {
    const mod: { name: string; val: unknown } = { name: fEntity.mod.name, val: true };
    if (isValidVal(fEntity.mod.val)) mod.val = fEntity.mod.val;
    result.entity['mod'] = mod;
  } else if (sEntity.mod) {
    const mod: { name: string; val: unknown } = { name: sEntity.mod.name, val: true };
    mod.val =
      fEntity.mod && isValidVal(fEntity.mod.val) ? fEntity.mod.val : sEntity.mod.val;
    result.entity['mod'] = mod;
  }

  return BemCell.create(result as unknown as Parameters<typeof BemCell.create>[0]);
}

export default assign;
