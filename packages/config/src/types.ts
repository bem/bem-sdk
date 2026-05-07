export interface LibConfig {
  path?: string;
  [key: string]: unknown;
}

export interface LevelConfig {
  path?: string;
  layer?: string;
  [key: string]: unknown;
}

export interface SetChunk {
  layer?: string;
  set?: string;
  library?: string;
}

export type SetDefinition = string | SetChunk | SetChunk[];

export interface RawConfig {
  __source?: string;
  root?: boolean;
  levels?: LevelConfig[] | Record<string, LevelConfig>;
  libs?: Record<string, LibConfig>;
  modules?: Record<string, unknown>;
  sets?: Record<string, SetDefinition>;
  [key: string]: unknown;
}

export interface MergedConfig {
  __source?: string;
  root?: boolean;
  levels?: LevelConfig[];
  libs?: Record<string, LibConfig>;
  modules?: Record<string, unknown>;
  sets?: Record<string, SetDefinition>;
  [key: string]: unknown;
}

export interface ConfigPlugin {
  (config: RawConfig, configs: RawConfig[], options: BemConfigOptions): RawConfig;
  (
    config: RawConfig,
    configs: RawConfig[],
    options: BemConfigOptions,
    cb: (resolved: RawConfig) => void,
  ): void;
}

export interface BemConfigOptions {
  /** Config filename (default: `'bem'`). */
  name?: string;
  /** Project root directory (default: `process.cwd()`). */
  cwd?: string;
  /** Fallback config used by `betterc` when no other configs are found. */
  defaults?: RawConfig;
  /** Custom path passed to `betterc` as `--config`. */
  pathToConfig?: string;
  /** Filesystem root for `betterc`. */
  fsRoot?: string;
  /** Home directory for `betterc`. */
  fsHome?: string;
  /** `betterc` `extendBy` option. */
  extendBy?: string;
  /** Extra plugins applied after the built-in `resolve-level`. */
  plugins?: ConfigPlugin[];
  /**
   * Pre-resolved configs. When provided, skips `betterc` and uses these
   * configs directly. Useful for tests and DI.
   */
  configs?: RawConfig[];
}
