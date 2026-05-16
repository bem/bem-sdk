import type { BemCell } from '@bem/sdk.cell';

interface LoopItem {
  entity?: { valueOf(): unknown };
  tech?: string;
}

export class CircularDependencyError extends Error {
  override readonly name = 'CircularDependencyError';
  private readonly _loop: BemCell[];

  constructor(loop?: Iterable<BemCell>) {
    const arr = loop ? Array.from(loop) : [];
    let message = 'dependency graph has circular dependencies';
    if (arr.length) {
      message = `${message} (${arr.map((c) => c.id).join(' <- ')})`;
    }
    super(message);
    this._loop = arr;
  }

  get loop(): LoopItem[] {
    return this._loop.map((item) => {
      const res: LoopItem = {};
      if (item.entity) res.entity = item.entity.valueOf() as LoopItem['entity'];
      if (item.tech) res.tech = item.tech;
      return res;
    });
  }
}

export default CircularDependencyError;
