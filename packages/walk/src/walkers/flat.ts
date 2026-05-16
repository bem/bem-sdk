import { promises as fs } from 'node:fs';
import path from 'node:path';

import { bemNamingEntityParse } from '@bem/sdk.naming.entity.parse';
import { create as createNamingPreset } from '@bem/sdk.naming.presets';
import { BemFile } from '@bem/sdk.file';

import type { WalkerInfo, WalkerAdd } from './types.js';

/**
 * Plugin to scan flat levels.
 */
export async function flat(info: WalkerInfo, add: WalkerAdd): Promise<void> {
  const levelpath = info.path;
  const parseEntityName = bemNamingEntityParse(
    createNamingPreset(info.naming as never),
  );

  const files = await fs.readdir(levelpath);
  for (const basename of files) {
    const dotIndex = basename.indexOf('.');
    if (dotIndex > 0) {
      const entity = parseEntityName(basename.substring(0, dotIndex));
      if (entity) {
        add(
          new BemFile({
            cell: {
              entity,
              tech: basename.substring(dotIndex + 1),
              layer: null,
            } as never,
            level: levelpath,
            path: path.join(levelpath, basename),
          }),
        );
      }
    }
  }
}

export default flat;
