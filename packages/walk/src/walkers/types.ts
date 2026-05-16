import type { BemFile } from '@bem/sdk.file';

export interface WalkerInfo {
  path: string;
  naming?: unknown;
}

export type WalkerAdd = (file: BemFile) => void;

export type Walker = (info: WalkerInfo, add: WalkerAdd) => Promise<void>;
