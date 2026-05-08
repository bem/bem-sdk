import type { BemEntityName } from '@bem/sdk.entity-name';

export interface BemJsonObject {
  block?: string;
  elem?: string;
  tag?: string;
  mods?: Record<string, unknown>;
  elemMods?: Record<string, unknown>;
  content?: BemJson;
  /** Catch-all for arbitrary attributes / nested entities. */
  [key: string]: unknown;
}

export type BemJson = BemJsonObject | BemJson[] | string;

export interface JSXNode {
  tag: string;
  props: Record<string, unknown>;
  children: JSXNode[] | JSXNode | undefined;
  bemEntity: BemEntityName | null;
  isText: boolean;
  simpleText: string;
  toString(): string;
}
