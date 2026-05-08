import { realpath } from 'node:fs/promises';
import { resolve as resolvePath } from 'node:path';
import { Readable } from 'node:stream';
import { deprecate } from 'node:util';

import {
  BemConfig,
  type BemConfigOptions,
  type LevelConfig,
  type RawConfig,
} from '@bem/sdk.config';

import { walkers, type Walker } from './walkers/index.js';

export type { Walker, WalkerInfo, WalkerAdd, WalkerName } from './walkers/index.js';
export { walkers };

const legacyCallLayerName = 'legacycall';

const warnLegacyApi = deprecate((): void => {
  /* deprecation marker */
}, 'Please stop using old API');

interface LegacyDefaults {
  scheme?: string;
  naming?: unknown;
  levels?: LevelConfig[];
  sets?: Record<string, string>;
  [key: string]: unknown;
}

export interface LegacyWalkOptions {
  defaults?: LegacyDefaults;
  levels?: Record<string, LevelConfig>;
  configs?: RawConfig[];
  [key: string]: unknown;
}

export interface WalkOptions {
  sets?: string;
  levels?: string | string[];
  config?: BemConfig | BemConfigOptions;
}

function ensureConfig(input?: BemConfig | BemConfigOptions): BemConfig {
  if (input instanceof BemConfig) return input;
  return new BemConfig(input ?? {});
}

export function walk(levels?: string[], options?: LegacyWalkOptions): Readable {
  if (!levels || !levels.length) {
    const empty = new Readable({ objectMode: true, read() {} });
    empty.push(null);
    return empty;
  }

  const config: LegacyWalkOptions = { ...(options ?? {}) };
  const defaults: LegacyDefaults = { ...(config.defaults ?? {}) };
  config.defaults = defaults;
  defaults.sets = { ...(defaults.sets ?? {}) };

  if (!defaults.levels) {
    if (config.levels && typeof config.levels === 'object') {
      defaults.levels = Object.entries(config.levels).map(
        ([levelPath, level]) => ({
          layer: legacyCallLayerName,
          ...level,
          path: levelPath,
        }),
      );
    } else {
      defaults.levels = levels.map((lvl) => ({
        path: lvl,
        layer: legacyCallLayerName,
      }));
    }
    defaults.sets[legacyCallLayerName] = [
      ...new Set(
        defaults.levels.map((l) => l.layer).filter((l): l is string => Boolean(l)),
      ),
    ].join(' ');
  }

  if (defaults.scheme) warnLegacyApi();

  return walkSets({
    sets: legacyCallLayerName,
    config: { defaults: defaults as RawConfig },
  });
}

export function walkSets(options: WalkOptions): Readable {
  const walkConfig = ensureConfig(options.config);
  const output = new Readable({ objectMode: true, read() {} });

  const levelConfigs = walkConfig.levelMapSync();

  walkConfig
    .levels(options.sets ?? legacyCallLayerName)
    .then(async (levelsForWalk) => {
      const add = (file: unknown): void => {
        output.push(file);
      };

      try {
        await Promise.all(
          levelsForWalk.map(async (level) => {
            await scanLevel(level, levelConfigs, add);
          }),
        );
        output.push(null);
      } catch (err) {
        output.emit('error', err);
      }
    })
    .catch((err) => output.emit('error', err));

  return output;
}

/**
 * Normalize a path to its absolute, real-filesystem form.
 *
 * - Always returns an absolute path (resolves `.`, `..` and relative
 *   segments against `process.cwd()`).
 * - Best-effort follows symlinks via `realpath`; falls back to the
 *   `path.resolve` form when the path does not yet exist on disk.
 *
 * Closes #335.
 */
async function canonicalize(input: string): Promise<string> {
  const absolute = resolvePath(input);
  try {
    return await realpath(absolute);
  } catch {
    return absolute;
  }
}

async function scanLevel(
  level: LevelConfig,
  levelConfigs: Record<string, LevelConfig>,
  add: (file: unknown) => void,
): Promise<void> {
  const inputPath = level.path!;
  const path = await canonicalize(inputPath);
  // Look up the per-level config first by the user-supplied form, then by
  // the canonicalized form — both should hit the same entry.
  const config =
    levelConfigs[inputPath] ??
    levelConfigs[path] ??
    levelConfigs[resolvePath(inputPath)] ??
    {};
  const isLegacyScheme = 'scheme' in config;
  const cfgNaming = (config as { naming?: unknown }).naming;
  const userNaming: Record<string, unknown> =
    typeof cfgNaming === 'object' && cfgNaming !== null
      ? { ...(cfgNaming as Record<string, unknown>) }
      : { preset: cfgNaming ?? (isLegacyScheme ? 'legacy' : 'origin') };

  const cfgScheme = (config as { scheme?: string }).scheme;
  if (cfgScheme) {
    const fs = (userNaming.fs as Record<string, unknown> | undefined) ?? {};
    fs.scheme = cfgScheme;
    userNaming.fs = fs;
  }

  const legacyWalker = (config as { legacyWalker?: boolean }).legacyWalker;
  const scheme: string | undefined =
    cfgScheme ??
    ((userNaming.fs as { scheme?: string } | undefined)?.scheme);

  let walker: Walker = walkers.sdk;
  if (legacyWalker || isLegacyScheme) {
    if (typeof scheme === 'string' && (walkers as Record<string, Walker>)[scheme]) {
      walker = (walkers as Record<string, Walker>)[scheme]!;
    }
  }

  await walker({ path, naming: userNaming }, add as never);
}

export async function asArray(
  ...args: Parameters<typeof walk>
): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    const files: unknown[] = [];
    walk(...args)
      .on('data', (file) => files.push(file))
      .on('error', reject)
      .on('end', () => resolve(files));
  });
}

const main = walk as typeof walk & {
  walk: typeof walkSets;
  asArray: typeof asArray;
};
main.walk = walkSets;
main.asArray = asArray;
export default main;
