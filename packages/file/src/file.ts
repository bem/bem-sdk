import { inspect } from 'node:util';

import { BemCell } from '@bem/sdk.cell';
import type { BemEntityName } from '@bem/sdk.entity-name';

import type {
  BemFileCreateOptions,
  BemFileOptions,
  BemFileRepresentation,
  Level,
  Path,
} from './types.js';

export class BemFile {
  /** @internal */
  readonly __isBemFile__ = true as const;

  /** @internal */
  private readonly _cell: BemCell;

  /** @internal */
  private readonly _level?: Level;

  /** @internal */
  private readonly _path?: Path;

  constructor(opts: BemFileOptions) {
    if (!opts || typeof opts !== 'object' || !opts.cell) {
      throw new Error('@bem/sdk.file: requires cell param');
    }

    if (opts.level != null && typeof opts.level !== 'string') {
      throw new Error('@bem/sdk.file: level should be a string or null');
    }
    if (opts.path != null && typeof opts.path !== 'string') {
      throw new Error('@bem/sdk.file: path should be a string or null');
    }

    this._cell = BemCell.create(opts.cell);
    if (opts.level != null) this._level = opts.level;
    if (opts.path != null) this._path = opts.path;
  }

  get cell(): BemCell {
    return this._cell;
  }

  get level(): Level | undefined {
    return this._level;
  }

  get path(): Path | undefined {
    return this._path;
  }

  get entity(): BemEntityName {
    return this._cell.entity;
  }

  get tech(): string | undefined {
    return this._cell.tech;
  }

  get layer(): string | undefined {
    return this._cell.layer;
  }

  /**
   * Stable identifier of the file: `<level>/<cell.id>` (level optional).
   */
  get id(): string {
    return (this._level ? `${this._level}/` : '') + this._cell.id;
  }

  toString(): string {
    return this.id;
  }

  valueOf(): BemFileRepresentation {
    const res: BemFileRepresentation = { cell: this._cell.valueOf() };
    if (this._path) res.path = this._path;
    if (this._level) res.level = this._level;
    return res;
  }

  toJSON(): BemFileRepresentation {
    return this.valueOf();
  }

  inspect(_depth?: number, options?: Parameters<typeof inspect>[1]): string {
    return `BemFile ${inspect(this.valueOf(), options)}`;
  }

  [inspect.custom](
    _depth?: number,
    options?: Parameters<typeof inspect>[1],
  ): string {
    return `BemFile ${inspect(this.valueOf(), options)}`;
  }

  isEqual(file: BemFile | null | undefined): boolean {
    if (!file) return false;
    return (
      file.path === this.path &&
      file.level === this.level &&
      file.cell.isEqual(this.cell)
    );
  }

  static isBemFile(file: unknown): file is BemFile {
    if (!file || typeof file !== 'object') return false;
    return Boolean((file as { __isBemFile__?: unknown }).__isBemFile__);
  }

  static create(obj: BemFileCreateOptions | BemFile): BemFile {
    if (BemFile.isBemFile(obj)) return obj;

    const opts: BemFileOptions = { cell: BemCell.create(obj) };
    if (obj.level) opts.level = obj.level;
    if (obj.path) opts.path = obj.path;
    return new BemFile(opts);
  }
}

export default BemFile;
