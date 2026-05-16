import { promises as fs } from 'node:fs';
import path from 'node:path';

import { BemFile } from '@bem/sdk.file';
import { bemNamingEntityParse } from '@bem/sdk.naming.entity.parse';
import { stringifyWrapper as createStringify } from '@bem/sdk.naming.entity.stringify';
import { create as createPreset } from '@bem/sdk.naming.presets';
import type { BemEntityName } from '@bem/sdk.entity-name';

import type { WalkerInfo, WalkerAdd } from './types.js';

interface DirItem {
  path: string;
  basename: string;
  stem: string;
  tech?: string;
}

async function readDirItems(dirname: string): Promise<DirItem[]> {
  const filenames = await fs.readdir(dirname);
  return filenames.map((basename) => {
    const dotIndex = basename.indexOf('.');
    if (dotIndex > 0) {
      return {
        path: path.join(dirname, basename),
        basename,
        stem: basename.substring(0, dotIndex),
        tech: basename.substring(dotIndex + 1),
      };
    }
    return { path: path.join(dirname, basename), basename, stem: basename };
  });
}

class LevelWalker {
  private readonly levelpath: string;
  private readonly add: WalkerAdd;
  private readonly naming: {
    parse: ReturnType<typeof bemNamingEntityParse>;
    stringify: ReturnType<typeof createStringify>;
  };

  constructor(info: WalkerInfo, add: WalkerAdd) {
    this.levelpath = info.path;
    const preset = createPreset(info.naming as never);
    this.naming = {
      parse: bemNamingEntityParse(preset),
      stringify: createStringify(preset),
    };
    this.add = add;
  }

  async scanLevel(): Promise<void> {
    const items = await readDirItems(this.levelpath);
    await Promise.all(
      items.map(async (item) => {
        const entity = this.naming.parse(item.stem);
        const type = entity?.type;
        if (!item.tech && type === 'block') {
          await this.scanBlockDir(item.path, item.basename);
        }
      }),
    );
  }

  async scanBlockDir(dirname: string, blockname: string): Promise<void> {
    const items = await readDirItems(dirname);
    await Promise.all(
      items.map(async (item) => {
        const { stem, tech } = item;
        if (tech) {
          if (blockname === stem) {
            this.add(
              new BemFile({
                cell: { block: blockname, tech, layer: null } as never,
                level: this.levelpath,
                path: item.path,
              }),
            );
          }
          return;
        }
        const entity = this.naming.parse(blockname + stem);
        const type = entity?.type;
        if (type === 'blockMod') {
          await this.scanBlockModDir(item.path, entity!);
        } else if (type === 'elem') {
          await this.scanElemDir(item.path, entity!);
        }
      }),
    );
  }

  async scanBlockModDir(dirname: string, scope: BemEntityName): Promise<void> {
    // Mod directory holds only leaf entries (no further recursion), so
    // there's no readdir-induced fan-out to parallelise — a sequential
    // pass over `items` is enough and keeps the order of `add()` calls
    // deterministic relative to the parent directory listing.
    const items = await readDirItems(dirname);
    for (const item of items) {
      const entity = this.naming.parse(item.stem);
      const tech = item.tech;
      if (
        tech &&
        entity &&
        scope.block === entity.block &&
        scope.mod?.name === entity.mod?.name
      ) {
        this.add(
          new BemFile({
            cell: { entity, tech, layer: null } as never,
            level: this.levelpath,
            path: item.path,
          }),
        );
      }
    }
  }

  async scanElemDir(dirname: string, scope: BemEntityName): Promise<void> {
    const items = await readDirItems(dirname);
    await Promise.all(
      items.map(async (item) => {
        const { stem, tech } = item;
        if (tech) {
          if (this.naming.stringify(scope) === stem) {
            const entity = this.naming.parse(stem);
            if (entity) {
              this.add(
                new BemFile({
                  cell: { entity, tech, layer: null } as never,
                  level: this.levelpath,
                  path: item.path,
                }),
              );
            }
          }
          return;
        }
        const entity = this.naming.parse(
          scope.block + path.basename(dirname) + stem,
        );
        const type = entity?.type;
        if (type === 'elemMod') {
          await this.scanElemModDir(item.path, entity!);
        }
      }),
    );
  }

  async scanElemModDir(dirname: string, scope: BemEntityName): Promise<void> {
    // Same reasoning as `scanBlockModDir`: leaf-only directory, sequential
    // iteration keeps `add()` order stable.
    const items = await readDirItems(dirname);
    for (const item of items) {
      const entity = this.naming.parse(item.stem);
      const tech = item.tech;
      if (
        tech &&
        entity &&
        scope.block === entity.block &&
        scope.elem === entity.elem &&
        scope.mod?.name === entity.mod?.name
      ) {
        this.add(
          new BemFile({
            cell: { entity, tech, layer: null } as never,
            level: this.levelpath,
            path: item.path,
          }),
        );
      }
    }
  }
}

export async function nested(info: WalkerInfo, add: WalkerAdd): Promise<void> {
  const walker = new LevelWalker(info, add);
  await walker.scanLevel();
}

export default nested;
