import type { BemCell } from '@bem/sdk.cell';
import type { BemEntityName } from '@bem/sdk.entity-name';

export type BemDeclFormat = 'v1' | 'v2' | 'enb' | 'harmony';

export type ExportType = 'json' | 'json5' | 'commonjs' | 'cjs' | 'es2015' | 'es6';

export interface DeclareEntity {
  block?: string;
  elem?: string | string[] | DeclareEntity[];
  elems?: string | DeclareEntity | (string | DeclareEntity)[];
  mod?: string;
  val?: unknown;
  mods?: string[] | Record<string, unknown>;
  modName?: string;
  modVal?: unknown;
  tech?: string;
  scope?: string | { block?: string; elem?: string };
}

export type RawDecl = string | DeclareEntity | (string | DeclareEntity)[];

export interface NormalizeOptions {
  format?: BemDeclFormat;
  scope?: BemCell;
}

export interface StringifyOptions {
  format?: BemDeclFormat;
  exportType?: ExportType;
  space?: string | number;
}

export interface FormatModule {
  format(decl: BemCell[]): unknown[];
  parse(data: { [key: string]: unknown; format?: string }): BemCell[];
}

export type { BemCell, BemEntityName };
