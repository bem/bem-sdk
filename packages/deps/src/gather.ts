import { strict as assert } from 'node:assert';
import { promises as fs } from 'node:fs';

import { BemConfig } from '@bem/sdk.config';
import walkMain from '@bem/sdk.walk';
import type { BemFile } from '@bem/sdk.file';

export interface GatherOptions {
  platform?: string;
  defaults?: Record<string, unknown>;
  config?: BemConfig | unknown;
}

interface ConfigLike {
  levels(set: string): Promise<Array<{ path?: string }>>;
  levelMap(): Promise<Record<string, unknown>>;
}

/**
 * Gathers `*.deps.js` files using bem-walk.
 */
export async function gather(
  options: GatherOptions = {},
): Promise<BemFile[]> {
  const { platform = 'desktop', defaults = {} } = options;
  const config = (options.config ?? new BemConfig({})) as ConfigLike;

  assert(
    typeof config.levels === 'function',
    'Missing description of levels in the configuration.',
  );

  const [levels, levelMap] = await Promise.all([
    config.levels(platform),
    config.levelMap(),
  ]);

  return new Promise<BemFile[]>((resolve, reject) => {
    const levelPaths = levels.map((l) => l.path ?? (l as never as string));
    const walker = walkMain(levelPaths, {
      levels: levelMap as never,
      defaults: defaults as never,
    });

    const res: BemFile[] = [];
    let pending = 1;
    let rejected = false;
    const settle = (): void => {
      if (--pending === 0) resolve(res);
    };

    walker
      .on('data', (file: BemFile) => {
        const tech = (file as unknown as { tech?: string }).tech;
        if (rejected || tech !== 'deps.js') return;
        pending += 1;
        fs.stat(file.path ?? '')
          .then((stats) => {
            if (rejected) return;
            if (stats.isFile()) res.push(file);
            settle();
          })
          .catch((err: unknown) => {
            if (rejected) return;
            rejected = true;
            reject(err);
          });
      })
      .on('error', (err: unknown) => {
        rejected = true;
        reject(err);
      })
      .on('end', () => settle());
  });
}

export default gather;
