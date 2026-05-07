import path from 'node:path';

import { glob, globSync } from 'glob';
import isGlob from 'is-glob';

import { merge } from '../merge.js';
import type { BemConfigOptions, LevelConfig, RawConfig } from '../types.js';

interface PluginContext {
  cwd: string;
  res: RawConfig;
  levels: LevelConfig[];
  levelsIndex: Record<string, number>;
  pathsToRemove: string[];
  source?: string;
}

export function resolveLevelSync(
  config: RawConfig,
  _configs: RawConfig[],
  options: BemConfigOptions,
): RawConfig {
  const ctx = makeContext(config, options);
  if (!ctx) return structuredClone(config);

  for (const level of ctx.levels) {
    ctx.levelsIndex[level.path!] = ctx.levels.indexOf(level);

    if (!isGlob(level.path!)) {
      onLevel(ctx, level.path!);
      if (!path.isAbsolute(level.path!)) ctx.pathsToRemove.push(level.path!);
      continue;
    }

    const globbedLevels = globSync(level.path!, { cwd: ctx.cwd });
    globbedLevels.forEach((levelPath, idx) => {
      onLevel(ctx, levelPath, level.path);
      if (globbedLevels.length - 1 === idx) ctx.pathsToRemove.push(level.path!);
    });
  }

  removeRelPaths(ctx);
  return ctx.res;
}

export async function resolveLevelAsync(
  config: RawConfig,
  _configs: RawConfig[],
  options: BemConfigOptions,
): Promise<RawConfig> {
  const ctx = makeContext(config, options);
  if (!ctx) return structuredClone(config);

  for (const level of ctx.levels) {
    ctx.levelsIndex[level.path!] = ctx.levels.indexOf(level);

    if (!isGlob(level.path!)) {
      onLevel(ctx, level.path!);
      if (!path.isAbsolute(level.path!)) ctx.pathsToRemove.push(level.path!);
      continue;
    }

    const globbedLevels = await glob(level.path!, { cwd: ctx.cwd });
    globbedLevels.forEach((levelPath, idx) => {
      onLevel(ctx, levelPath, level.path);
      if (globbedLevels.length - 1 === idx) ctx.pathsToRemove.push(level.path!);
    });
  }

  removeRelPaths(ctx);
  return ctx.res;
}

function makeContext(
  config: RawConfig,
  options: BemConfigOptions,
): PluginContext | null {
  const cwd = options.cwd ?? process.cwd();
  const source = config.__source;
  const res = structuredClone(config);
  const levels = (res.levels as LevelConfig[] | undefined) ?? [];

  if (!levels.length) return null;

  return {
    cwd,
    res,
    levels,
    levelsIndex: {},
    pathsToRemove: [],
    ...(source !== undefined ? { source } : {}),
  };
}

function onLevel(ctx: PluginContext, levelPath: string, globLevelPath?: string): void {
  const effectiveGlob = globLevelPath ?? levelPath;
  const resolvedLevel = path.resolve(
    ctx.source ? path.dirname(ctx.source) : ctx.cwd,
    levelPath,
  );

  if (resolvedLevel === levelPath && levelPath === effectiveGlob) return;

  if (ctx.levelsIndex[resolvedLevel] === undefined) {
    ctx.levelsIndex[resolvedLevel] =
      ctx.levels.push({ path: resolvedLevel } as LevelConfig) - 1;
  }

  const targetIdx = ctx.levelsIndex[resolvedLevel]!;
  const sourceIdx = ctx.levelsIndex[effectiveGlob];
  if (sourceIdx === undefined) return;
  const sourceLevel = ctx.levels[sourceIdx]!;

  merge(ctx.levels[targetIdx]!, { ...sourceLevel, path: undefined });
}

function removeRelPaths(ctx: PluginContext): void {
  ctx.pathsToRemove.forEach((pathToRemove, shiftIdx) => {
    const idx = ctx.levelsIndex[pathToRemove];
    if (idx === undefined) return;
    ctx.levels.splice(idx - shiftIdx, 1);
    delete ctx.levelsIndex[pathToRemove];
  });
}
