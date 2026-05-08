import type { EntityLike } from '@bem/sdk.naming.entity.stringify';

export interface NamingDelims {
  elem?: string;
  mod?: string | { name?: string; val?: string };
}

export interface FsConvention {
  pattern: string;
  scheme: 'flat' | 'nested' | string;
  delims?: NamingDelims;
  /** Layer name to omit from the rendered path. */
  defaultLayer?: string;
}

export interface NamingConvention {
  fs: FsConvention;
  delims?: NamingDelims;
}

export interface BemCellLike {
  entity: EntityLike;
  tech?: string;
  layer?: string;
  /** Used only for diagnostics in the assertion message. */
  id?: string;
}

export type CellStringify = (cell: BemCellLike) => string;
