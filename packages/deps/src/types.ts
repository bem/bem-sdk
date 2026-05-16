import type { BemCell } from '@bem/sdk.cell';
import type { BemEntityName } from '@bem/sdk.entity-name';
import type { BemFile } from '@bem/sdk.file';

export type { BemCell, BemEntityName, BemFile };

export interface FileWithData {
  file: BemFile;
  path?: string;
  data?: unknown;
  scope?: BemCell;
  entity?: BemEntityName;
  [key: string]: unknown;
}

export interface DepsLink {
  vertex: BemCell | { entity: BemEntityName | { block: string; elem?: string; mod?: unknown }; tech?: string };
  dependOn: BemCell | { entity: BemEntityName | { block: string; elem?: string; mod?: unknown }; tech?: string };
  ordered?: boolean;
  path?: string;
}

export interface ResolveOptions {
  tech?: string;
}

export interface ResolveResult {
  entities: unknown[];
  dependOn: Array<{ tech: string; entities: unknown[] }>;
}

export interface DepsFormat {
  reader: (file: BemFile) => Promise<FileWithData>;
  parser: (data: FileWithData | FileWithData[]) => DepsLink[];
}
