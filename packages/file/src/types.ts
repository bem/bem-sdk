import type {
  BemCell,
  BemCellCreateOptions,
  BemCellRepresentation,
} from '@bem/sdk.cell';

export type Level = string;
export type Path = string;

/**
 * Object accepted by `new BemFile(obj)`.
 */
export interface BemFileOptions {
  cell: BemCell | BemCellCreateOptions;
  level?: Level | null;
  path?: Path | null;
}

/**
 * Object accepted by `BemFile.create(obj)`.
 *
 * Either provide a nested `cell`/`entity` or flat block/elem/mod fields.
 */
export interface BemFileCreateOptions extends BemCellCreateOptions {
  level?: Level;
  path?: Path;
}

export interface BemFileRepresentation {
  cell: BemCellRepresentation;
  level?: Level;
  path?: Path;
}

export type { BemCell };
