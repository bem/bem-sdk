import { expect } from 'chai';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { asArray } from './index.js';

interface FileLike {
  cell: { entity: { valueOf(): unknown }; tech: string };
  level: string;
  path: string;
}

async function setupTree(
  layout: Record<string, Record<string, string>>,
): Promise<string> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'bem-sdk-walk-'));
  for (const [dir, files] of Object.entries(layout)) {
    const fullDir = path.join(root, dir);
    await fs.mkdir(fullDir, { recursive: true });
    for (const [name, content] of Object.entries(files)) {
      await fs.writeFile(path.join(fullDir, name), content);
    }
  }
  return root;
}

async function cleanup(root: string): Promise<void> {
  await fs.rm(root, { recursive: true, force: true });
}

describe('walk / asArray', () => {
  it('returns empty array for empty cwd', async () => {
    const root = await setupTree({});
    try {
      const files = await asArray([path.join(root, '.')]);
      expect(files).to.eql([]);
    } finally {
      await cleanup(root);
    }
  });

  it('rejects on missing directory', () => {
    return asArray(['unknown-direction-' + Date.now()]).then(
      () => {
        throw new Error('expected rejection');
      },
      (err: NodeJS.ErrnoException) => {
        expect(err.code === 'ENOENT' || /ENOENT/.test(String(err))).to.equal(
          true,
        );
      },
    );
  });
});

describe('walk / sdk walker (default)', () => {
  it('finds a block under blocks/', async () => {
    const root = await setupTree({
      'blocks/button': { 'button.css': '' },
    });
    try {
      const files = (await asArray([root])) as FileLike[];
      const blocks = files.map(
        (f) => (f.cell.entity.valueOf() as { block: string }).block,
      );
      expect(blocks).to.include('button');
    } finally {
      await cleanup(root);
    }
  });

  it('finds a block + mod in nested layout', async () => {
    const root = await setupTree({
      'blocks/button': { 'button.css': '' },
      'blocks/button/_size': { 'button_size_l.css': '' },
    });
    try {
      const files = (await asArray([root])) as FileLike[];
      const ids = files.map((f) => {
        const v = f.cell.entity.valueOf() as {
          block: string;
          mod?: { name: string; val?: unknown };
        };
        return v.mod ? `${v.block}_${v.mod.name}` : v.block;
      });
      expect(ids).to.include('button');
      expect(ids).to.include('button_size');
    } finally {
      await cleanup(root);
    }
  });
});

describe('walk / path normalization (#335)', () => {
  it('canonicalizes a relative `.`-prefixed path against cwd', async () => {
    const root = await setupTree({
      'blocks/button': { 'button.css': '' },
    });
    const prevCwd = process.cwd();
    try {
      process.chdir(root);
      const files = (await asArray(['./blocks/..'])) as FileLike[];
      expect(files.map(
        (f) => (f.cell.entity.valueOf() as { block: string }).block,
      )).to.include('button');
    } finally {
      process.chdir(prevCwd);
      await cleanup(root);
    }
  });

  it('follows a symlinked level via realpath', async () => {
    const root = await setupTree({
      'real/blocks/header': { 'header.css': '' },
    });
    try {
      const linkPath = path.join(root, 'symlinked');
      await fs.symlink(path.join(root, 'real'), linkPath);
      const files = (await asArray([linkPath])) as FileLike[];
      const blocks = files.map(
        (f) => (f.cell.entity.valueOf() as { block: string }).block,
      );
      expect(blocks).to.include('header');
    } finally {
      await cleanup(root);
    }
  });
});

describe('walk / flat scheme (legacy)', () => {
  it('reads files from a flat level', async () => {
    const root = await setupTree({
      'name.blocks': { 'block.tech': '' },
    });
    try {
      const files = (await asArray(
        [path.join(root, 'name.blocks')],
        {
          levels: {
            [path.join(root, 'name.blocks')]: { scheme: 'flat' },
          },
        },
      )) as FileLike[];
      expect(files).to.have.lengthOf(1);
      const file = files[0]!;
      expect(file.cell.entity.valueOf()).to.deep.equal({ block: 'block' });
      expect(file.cell.tech).to.equal('tech');
    } finally {
      await cleanup(root);
    }
  });

  it('supports several flat levels', async () => {
    const root = await setupTree({
      'level-1': { 'block-1.tech': '' },
      'level-2': { 'block-2.tech': '' },
    });
    try {
      const files = (await asArray(
        [path.join(root, 'level-1'), path.join(root, 'level-2')],
        {
          levels: {
            [path.join(root, 'level-1')]: { scheme: 'flat' },
            [path.join(root, 'level-2')]: { scheme: 'flat' },
          },
        },
      )) as FileLike[];
      const names = files.map(
        (f) => (f.cell.entity.valueOf() as { block: string }).block,
      );
      expect(names).to.have.members(['block-1', 'block-2']);
    } finally {
      await cleanup(root);
    }
  });
});
