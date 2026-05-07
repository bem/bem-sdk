import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect } from 'chai';

import { bemConfig, type RawConfig } from './index.js';

const __filename = fileURLToPath(import.meta.url);

function withConfigs(configs: RawConfig[]) {
  return bemConfig({ configs });
}

describe('config (async)', () => {
  it('should return empty config', async () => {
    expect(await withConfigs([{}]).configs()).to.deep.equal([{}]);
  });

  it('should return given configs', async () => {
    expect(
      await withConfigs([{ test: 1 }, { test: 2 }]).configs(),
    ).to.deep.equal([{ test: 1 }, { test: 2 }]);
  });

  it('should return project root', async () => {
    const cfg = withConfigs([
      { test: 1, __source: 'some/path' },
      { test: 2, root: true, __source: __filename },
      { other: 'field', __source: 'some/other/path' },
    ]);
    expect(await cfg.root()).to.equal(path.dirname(__filename));
  });

  it('should return merged config', async () => {
    const cfg = withConfigs([{ test: 1 }, { test: 2 }, { other: 'field' }]);
    expect(await cfg.get()).to.deep.equal({ test: 2, other: 'field' });
  });

  it('should return undefined if no levels in config', async () => {
    expect(await withConfigs([{}]).level('l1')).to.equal(undefined);
  });

  it('should return undefined if no level found', async () => {
    expect(
      await withConfigs([
        { levels: [{ path: 'l1', some: 'conf' }] },
      ]).level('l2'),
    ).to.equal(undefined);
  });

  it('should return level if no __source provided', async () => {
    const cfg = withConfigs([
      { levels: [{ path: 'path/to/level', test: 1 }] },
    ]);
    const level = await cfg.level('path/to/level');
    expect(level).to.deep.equal({ test: 1 });
  });

  it('should return level with __source', async () => {
    const cfg = withConfigs([
      {
        levels: [{ path: 'path/to/level', test: 1 }],
        __source: path.join(process.cwd(), path.basename(__filename)),
      },
    ]);
    expect(await cfg.level('path/to/level')).to.deep.equal({ test: 1 });
  });

  it('should return undefined if no modules in config', async () => {
    expect(await withConfigs([{}]).module('m1')).to.equal(undefined);
  });

  it('should return module', async () => {
    const cfg = withConfigs([
      { modules: { m1: { test: 1 } } },
      { modules: { m1: { test: 2 } } },
    ]);
    expect(await cfg.module('m1')).to.deep.equal({ test: 2 });
  });

  it('should return empty map on levelMap if no levels found', async () => {
    expect(await withConfigs([{}]).levelMap()).to.deep.equal({});
  });
});

describe('config (sync)', () => {
  it('should return empty config', () => {
    expect(withConfigs([{}]).configs(true)).to.deep.equal([{}]);
  });

  it('should return given configs', () => {
    expect(
      withConfigs([{ test: 1 }, { test: 2 }]).configs(true),
    ).to.deep.equal([{ test: 1 }, { test: 2 }]);
  });

  it('should return merged config', () => {
    expect(
      withConfigs([{ test: 1 }, { test: 2 }, { other: 'field' }]).getSync(),
    ).to.deep.equal({ test: 2, other: 'field' });
  });

  it('should return level', () => {
    const cfg = withConfigs([
      { levels: [{ path: 'path/to/level', test: 1 }] },
    ]);
    expect(cfg.levelSync('path/to/level')).to.deep.equal({ test: 1 });
  });

  it('should respect __source for project root', () => {
    const cfg = withConfigs([
      { test: 1, __source: 'some/path' },
      { test: 2, root: true, __source: __filename },
      { other: 'field', __source: 'some/other/path' },
    ]);
    cfg.configs(true);
    expect(cfg.rootSync()).to.equal(path.dirname(__filename));
  });

  it('should override arrays when merging levels from different configs', () => {
    const cfg = withConfigs([
      {
        levels: [
          {
            path: 'level1',
            tech: ['css'],
            mods: ['theme'],
          },
        ],
      },
      {
        levels: [
          {
            path: 'level1',
            tech: ['ts'],
          },
        ],
      },
    ]);
    const lvl = cfg.levelSync('level1');
    expect(lvl?.['tech']).to.deep.equal(['ts']);
    expect(lvl?.['mods']).to.deep.equal(['theme']);
  });

  it('should return undefined for missing module', () => {
    expect(withConfigs([{ modules: {} }]).moduleSync('m1')).to.equal(undefined);
  });

  it('should return module', () => {
    expect(
      withConfigs([{ modules: { m1: { x: 1 } } }]).moduleSync('m1'),
    ).to.deep.equal({ x: 1 });
  });
});

describe('config: levels & sets', () => {
  it('should return empty array when set is unknown', async () => {
    const cfg = withConfigs([
      {
        levels: [{ path: 'common.blocks', layer: 'common' }],
        sets: { desktop: 'common' },
      },
    ]);
    expect(await cfg.levels('unknown')).to.deep.equal([]);
  });

  it('should return levels for a set', async () => {
    const cfg = withConfigs([
      {
        levels: [{ path: 'common.blocks', layer: 'common' }],
        sets: { desktop: 'common' },
      },
    ]);
    const levels = await cfg.levels('desktop');
    expect(levels).to.have.lengthOf(1);
    expect(levels[0]?.layer).to.equal('common');
  });
});
