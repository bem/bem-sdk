import { promises as fs } from 'node:fs';
import path from 'node:path';

import { BemFile } from '@bem/sdk.file';
import { bemNamingCellMatch } from '@bem/sdk.naming.cell.match';
import { create as createNamingPreset } from '@bem/sdk.naming.presets';

import type { WalkerInfo, WalkerAdd } from './types.js';

/**
 * Default walker — uses naming.cell.match to recognize a path as a BEM cell.
 */
export async function sdkWalker(
  info: WalkerInfo,
  add: WalkerAdd,
): Promise<void> {
  const conv = createNamingPreset((info.naming ?? 'origin') as never);
  const match = bemNamingCellMatch(conv as never);

  await deeperInDir(info.path);

  async function deeperInDir(dir: string): Promise<void> {
    let filenames: string[];
    try {
      filenames = await fs.readdir(dir);
    } catch (err) {
      const e = err as NodeJS.ErrnoException;
      if (e.code === 'ENOTDIR') return;
      throw err;
    }

    for (const basename of filenames) {
      const filepath = path.join(dir, basename);
      const relPath = path.relative(info.path, filepath);
      const matchResult = match(relPath.replace(/\\/g, '/'));

      if (matchResult.cell) {
        if (!matchResult.rest) {
          add(
            new BemFile({
              cell: matchResult.cell,
              level: info.path,
              path: filepath,
            }),
          );
        }
      } else if (matchResult.isMatch) {
        await deeperInDir(filepath);
      }
    }
  }
}

export default sdkWalker;
