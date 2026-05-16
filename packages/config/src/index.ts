import assert from 'node:assert';
import { existsSync } from 'node:fs';
import path from 'node:path';

import betterc from 'betterc';

import { merge } from './merge.js';
import {
  resolveLevelAsync,
  resolveLevelSync,
} from './plugins/resolve-level.js';
import { resolveSets } from './resolve-sets.js';
import type {
  BemConfigOptions,
  LevelConfig,
  MergedConfig,
  RawConfig,
} from './types.js';

export type {
  BemConfigOptions,
  LevelConfig,
  LibConfig,
  MergedConfig,
  RawConfig,
  SetChunk,
  SetDefinition,
  ConfigPlugin,
} from './types.js';
export { merge } from './merge.js';
export { resolveSets } from './resolve-sets.js';

const SPECIAL_KEYS = new Set(['sets', 'levels', 'libs', 'modules', '__source']);

interface BettercOptions {
  defaults?: RawConfig;
  cwd?: string;
  fsRoot?: string;
  fsHome?: string;
  name?: string;
  extendBy?: string;
  argv?: { config?: string };
}

type BettercFn = ((opts: BettercOptions) => Promise<RawConfig[]>) & {
  sync(opts: BettercOptions): RawConfig[];
};

const rc = betterc as unknown as BettercFn;

export class BemConfig {
  private readonly _options: BemConfigOptions;
  private _cachedConfigs?: RawConfig[];
  private _root?: string;

  constructor(options: BemConfigOptions = {}) {
    if (options.cwd !== undefined && !path.isAbsolute(options.cwd)) {
      throw new Error(
        `@bem/sdk.config: 'cwd' option must be an absolute path, got '${options.cwd}'`,
      );
    }
    this._options = { ...options };
    if (!this._options.cwd) this._options.cwd = process.cwd();
  }

  /**
   * Returns the level config that covers a given file or directory path.
   *
   * Picks the most specific (longest) level whose `path` is a prefix of
   * the input, respecting directory boundaries (e.g. `/a/b/blocks` does
   * not match `/a/b/blocks-extra/...`). Returns `undefined` when no level
   * applies. Relative inputs are resolved against `options.cwd`.
   *
   * Closes #277.
   */
  async levelByPath(input: string): Promise<LevelConfig | undefined> {
    const map = await this.levelMap();
    return pickLevelByPath(map, input, this._options.cwd!);
  }

  /** Synchronous counterpart of {@link levelByPath}. */
  levelByPathSync(input: string): LevelConfig | undefined {
    const map = this.levelMapSync();
    return pickLevelByPath(map, input, this._options.cwd!);
  }

  /** Returns all found configs (after the `resolve-level` plugin pass). */
  configs(): Promise<RawConfig[]>;
  configs(isSync: false): Promise<RawConfig[]>;
  configs(isSync: true): RawConfig[];
  configs(isSync = false): RawConfig[] | Promise<RawConfig[]> {
    const options = this._options;
    const cwd = options.cwd!;

    const builtinPlugin = isSync ? resolveLevelSync : resolveLevelAsync;
    const extraPlugins = options.plugins ?? [];

    if (isSync) {
      const cfgs = doSomeMagicProcedure(
        this._cachedConfigs ?? (this._cachedConfigs = this._loadConfigsSync()),
        cwd,
      );
      this._root = getConfigsRootDir(cfgs);

      let acc: RawConfig[] = cfgs.map((c) =>
        builtinPlugin(c, cfgs, options) as RawConfig,
      );
      for (const plugin of extraPlugins) {
        acc = acc.map((c) =>
          (plugin as (...args: unknown[]) => RawConfig)(c, acc, options),
        );
      }
      return acc;
    }

    const fetchConfigsP = this._cachedConfigs
      ? Promise.resolve(this._cachedConfigs)
      : this._loadConfigsAsync().then((cfgs) => {
          this._cachedConfigs = cfgs;
          return cfgs;
        });

    return fetchConfigsP.then(async (cfgs) => {
      doSomeMagicProcedure(cfgs, cwd);
      this._root = getConfigsRootDir(cfgs);

      let acc: RawConfig[] = await Promise.all(
        cfgs.map((c) => (builtinPlugin as typeof resolveLevelAsync)(c, cfgs, options)),
      );
      for (const plugin of extraPlugins) {
        acc = await Promise.all(
          acc.map(
            (c) =>
              new Promise<RawConfig>((resolve) => {
                (plugin as unknown as (
                  cfg: RawConfig,
                  cfgs: RawConfig[],
                  opts: BemConfigOptions,
                  cb: (resolved: RawConfig) => void,
                ) => void)(c, acc, options, resolve);
              }),
          ),
        );
      }
      return acc;
    });
  }

  private _loadConfigsAsync(): Promise<RawConfig[]> {
    if (this._options.configs) return Promise.resolve(this._options.configs);
    return rc(this._buildRcOpts());
  }

  private _loadConfigsSync(): RawConfig[] {
    if (this._options.configs) return this._options.configs;
    return rc.sync(this._buildRcOpts());
  }

  private _buildRcOpts(): BettercOptions {
    const o = this._options;
    const opts: BettercOptions = {
      cwd: o.cwd!,
      ...(o.defaults != null
        ? { defaults: JSON.parse(JSON.stringify(o.defaults)) as RawConfig }
        : {}),
      ...(o.fsRoot !== undefined ? { fsRoot: o.fsRoot } : {}),
      ...(o.fsHome !== undefined ? { fsHome: o.fsHome } : {}),
      name: o.name ?? 'bem',
      ...(o.extendBy !== undefined ? { extendBy: o.extendBy } : {}),
    };
    if (o.pathToConfig) opts.argv = { config: o.pathToConfig };
    return opts;
  }

  /** Project root path. */
  async root(): Promise<string | undefined> {
    if (!this._root) await this.configs();
    return this._root;
  }

  /** Project root path (sync). */
  rootSync(): string | undefined {
    if (this._root) return this._root;
    this.configs(true);
    return this._root;
  }

  /** Merged config. */
  async get(): Promise<MergedConfig> {
    return merge(await this.configs()) as MergedConfig;
  }

  /** Merged config (sync). */
  getSync(): MergedConfig {
    return merge(this.configs(true)) as MergedConfig;
  }

  /** Resolves config for given level. */
  async level(pathToLevel: string): Promise<LevelConfig | undefined> {
    const configs = await this.configs();
    return getLevelByConfigs(pathToLevel, this._options, configs, this._root);
  }

  /** Resolves config for given level (sync). */
  levelSync(pathToLevel: string): LevelConfig | undefined {
    return getLevelByConfigs(
      pathToLevel,
      this._options,
      this.configs(true),
      this._root,
    );
  }

  /** Returns config for given library (async). */
  async library(libName: string): Promise<BemConfig> {
    const config = await this.get();
    const libs = config.libs;
    const lib = libs?.[libName];

    if (lib !== undefined && typeof lib !== 'object') {
      throw new Error('Invalid `libs` format');
    }

    const cwd = lib?.path ?? path.resolve('node_modules', libName);
    if (!existsSync(cwd)) {
      throw new Error(`Library ${libName} was not found at ${cwd}`);
    }
    return new BemConfig({ cwd: path.resolve(cwd) });
  }

  /** Returns config for given library (sync). */
  librarySync(libName: string): BemConfig {
    const config = this.getSync();
    const libs = config.libs;
    const lib = libs?.[libName];

    assert(
      lib === undefined || typeof lib === 'object',
      'Invalid `libs` format',
    );

    const cwd = lib?.path ?? path.resolve('node_modules', libName);
    assert(existsSync(cwd), `Library ${libName} was not found at ${cwd}`);

    return new BemConfig({ cwd: path.resolve(cwd) });
  }

  /** Returns map of settings for each level (async). */
  async levelMap(): Promise<Record<string, LevelConfig>> {
    const config = await this.get();
    const projectLevels = config.levels ?? [];
    const libNames = config.libs ? Object.keys(config.libs) : [];
    const commonOpts = pickCommonOpts(config);

    const libLevelLists = await Promise.all(
      libNames.map(async (name) => {
        const libConf = await this.library(name);
        const libConfig = await libConf.get();
        return libConfig.levels;
      }),
    );

    const allLevels: LevelConfig[] = [
      ...libLevelLists.flat().filter(Boolean) as LevelConfig[],
      ...projectLevels,
    ];

    return allLevels.reduce<Record<string, LevelConfig>>((res, lvl) => {
      res[lvl.path!] = merge<LevelConfig>(
        {},
        commonOpts as LevelConfig,
        res[lvl.path!] ?? {},
        lvl,
      );
      return res;
    }, {});
  }

  /** Returns map of settings for each level (sync). */
  levelMapSync(): Record<string, LevelConfig> {
    const config = this.getSync();
    const projectLevels = config.levels ?? [];
    const libNames = config.libs ? Object.keys(config.libs) : [];
    const commonOpts = pickCommonOpts(config);

    const libLevels: LevelConfig[] = libNames
      .flatMap((libName) => {
        const libConf = this.librarySync(libName);
        return libConf.getSync().levels ?? [];
      })
      .filter(Boolean);

    const allLevels: LevelConfig[] = [...libLevels, ...projectLevels];
    return allLevels.reduce<Record<string, LevelConfig>>((acc, level) => {
      acc[level.path!] = { ...commonOpts, ...level };
      return acc;
    }, {});
  }

  /** Returns levels of a named set (async). */
  async levels(setName: string): Promise<LevelConfig[]> {
    const config = await this.get();
    const levels = config.levels ?? [];
    const sets = config.sets ?? {};

    if (!sets[setName]) return [];

    const resolvedSets = resolveSets(sets);
    const set = resolvedSets[setName];
    if (!set || !set.length) return [];

    const levelsMap = await this.levelMap();

    const chunks = await Promise.all(
      set.map(async (chunk) => {
        if (chunk.library) {
          const libConfig = await this.library(chunk.library);
          assert(libConfig, `Library \`${chunk.library}\` was not found`);
          const libConfigData = await libConfig.get();
          if (config.__source === libConfigData.__source) {
            console.warn(
              `no config was found in \`${chunk.library}\` library`,
            );
            return [];
          }
          return libConfig.levels(chunk.set ?? setName);
        }

        if (chunk.set) return this.levels(chunk.set);

        return levels.reduce<LevelConfig[]>((acc, lvl) => {
          if (lvl.layer !== chunk.layer) return acc;
          const levelPath = lvl.path ?? `${lvl.layer}.blocks`;
          if (levelsMap[levelPath]) acc.push(levelsMap[levelPath]);
          return acc;
        }, []);
      }),
    );

    return chunks.flat();
  }

  /** Returns levels of a named set (sync). */
  levelsSync(setName: string): LevelConfig[] {
    const config = this.getSync();
    const levels = config.levels ?? [];
    const levelsMap = this.levelMapSync();
    const sets = config.sets ?? {};

    if (!sets[setName]) return [];

    const resolvedSets = resolveSets(sets);
    const set = resolvedSets[setName] ?? [];

    return set.reduce<LevelConfig[]>((acc, chunk) => {
      if (chunk.library) {
        const libConfig = this.librarySync(chunk.library);
        assert(libConfig, `Library \`${chunk.library}\` was not found`);
        if (config.__source === libConfig.getSync().__source) {
          console.error(
            `WARN: no config was found in \`${chunk.library}\` library`,
          );
          return acc;
        }
        return acc.concat(libConfig.levelsSync(chunk.set ?? setName));
      }

      if (chunk.set) return acc.concat(this.levelsSync(chunk.set));

      for (const lvl of levels) {
        if (lvl.layer !== chunk.layer) continue;
        const levelPath = lvl.path ?? `${lvl.layer}.blocks`;
        if (levelsMap[levelPath]) acc.push(levelsMap[levelPath]);
      }
      return acc;
    }, []);
  }

  /** Returns config for given module name (async). */
  async module(moduleName: string): Promise<unknown> {
    const config = await this.get();
    return config.modules?.[moduleName];
  }

  /** Returns config for given module name (sync). */
  moduleSync(moduleName: string): unknown {
    return this.getSync().modules?.[moduleName];
  }
}

function pickLevelByPath(
  map: Record<string, LevelConfig>,
  input: string,
  cwd: string,
): LevelConfig | undefined {
  const absolute = path.resolve(cwd, input);

  // Match path against levels with directory-boundary awareness so that
  // `/a/b/blocks` does not collide with `/a/b/blocks-extra/…`.
  const inputWithSep = absolute + path.sep;
  let best: { path: string; cfg: LevelConfig } | undefined;
  for (const [levelPath, cfg] of Object.entries(map)) {
    const lvlNorm = path.resolve(levelPath);
    if (
      absolute === lvlNorm ||
      inputWithSep.startsWith(lvlNorm + path.sep)
    ) {
      if (!best || lvlNorm.length > best.path.length) {
        best = { path: lvlNorm, cfg };
      }
    }
  }
  return best?.cfg;
}

function pickCommonOpts(config: MergedConfig): Record<string, unknown> {
  return Object.keys(config)
    .filter((k) => !SPECIAL_KEYS.has(k))
    .reduce<Record<string, unknown>>((acc, k) => {
      acc[k] = (config as Record<string, unknown>)[k];
      return acc;
    }, {});
}

function getConfigsRootDir(configs: RawConfig[]): string | undefined {
  const rootCfg = [...configs].reverse().find((cfg) => cfg.root && cfg.__source);
  if (rootCfg?.__source) return path.dirname(rootCfg.__source);
  return undefined;
}

function getLevelByConfigs(
  pathToLevel: string,
  options: BemConfigOptions,
  allConfigs: RawConfig[],
  root?: string,
): LevelConfig | undefined {
  const absLevelPath = path.resolve(root ?? options.cwd!, pathToLevel);
  let levelOpts: LevelConfig = {};
  let commonOpts: RawConfig = {};

  for (let i = allConfigs.length - 1; i >= 0; i--) {
    const conf = allConfigs[i]!;
    const levels = (conf.levels as LevelConfig[] | undefined) ?? [];

    commonOpts = merge<RawConfig>({}, conf, commonOpts);

    for (const level of levels) {
      if (!level || level.path !== absLevelPath) continue;
      levelOpts = merge<LevelConfig>({}, level, levelOpts);
    }

    if (conf.root) break;
  }

  levelOpts = merge<LevelConfig>(commonOpts as LevelConfig, levelOpts);

  delete (levelOpts as RawConfig).__source;
  delete levelOpts.path;
  delete (levelOpts as RawConfig).levels;
  delete (levelOpts as RawConfig).root;

  return Object.keys(levelOpts).length ? levelOpts : undefined;
}

/**
 * Mutates configs: normalises `levels` from `Record` to array form and fills
 * default level paths relative to the config's `__source`.
 */
function doSomeMagicProcedure(configs: RawConfig[], cwd: string): RawConfig[] {
  for (const config of configs) {
    const rawLevels = config.levels;
    if (!rawLevels) continue;

    if (!Array.isArray(rawLevels)) {
      config.levels = Object.keys(rawLevels).map((levelPath) => ({
        path: levelPath,
        ...rawLevels[levelPath],
      }));
      continue;
    }

    let levelPrefix = '';
    if (config.__source && path.dirname(config.__source) !== cwd) {
      levelPrefix = path.relative(path.dirname(config.__source), cwd);
    }

    for (const level of rawLevels) {
      if (!level.path) {
        level.path = path.join(levelPrefix, `${level.layer}.blocks`);
      }
    }
  }
  return configs;
}

/**
 * Factory function — primary entry point. Mirrors the legacy default export
 * (`require('@bem/sdk.config')(opts)`).
 */
export function bemConfig(options?: BemConfigOptions): BemConfig {
  return new BemConfig(options);
}

export default bemConfig;
