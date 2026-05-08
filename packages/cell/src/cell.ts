import { inspect } from 'node:util';

import { BemEntityName } from '@bem/sdk.entity-name';

import { emitDeprecation } from './deprecate.js';
import type {
  BemCellCreateOptions,
  BemCellOptions,
  BemCellRepresentation,
  BlockName,
  ElementName,
  Layer,
  Modifier,
  ModifierName,
  ModifierValue,
  Tech,
} from './types.js';

export class BemCell {
  /** @internal */
  readonly __isBemCell__ = true as const;

  /** @internal */
  private readonly _entity: BemEntityName;

  /** @internal */
  private readonly _tech?: Tech;

  /** @internal */
  private readonly _layer?: Layer;

  /** @internal */
  private _id?: string;

  constructor(obj: BemCellOptions) {
    if (!obj || !obj.entity) {
      throw new Error('Required `entity` field');
    }
    if (!BemEntityName.isBemEntityName(obj.entity)) {
      throw new Error('The `entity` field should be an instance of BemEntityName');
    }

    this._entity = obj.entity;
    if (obj.tech !== undefined) this._tech = obj.tech;
    if (obj.layer !== undefined) this._layer = obj.layer;
  }

  get entity(): BemEntityName {
    return this._entity;
  }

  get tech(): Tech | undefined {
    return this._tech;
  }

  get layer(): Layer | undefined {
    return this._layer;
  }

  /** Proxies `block` from entity. */
  get block(): BlockName {
    return this._entity.block;
  }

  /** Proxies `elem` from entity. */
  get elem(): ElementName | undefined {
    return this._entity.elem;
  }

  /** Proxies `mod` from entity. */
  get mod(): Modifier | undefined {
    return this._entity.mod;
  }

  /** @deprecated use `mod.name` */
  get modName(): ModifierName | undefined {
    emitDeprecation(
      "modName: just for compatibility and can be dropped in future. Instead use 'mod.name'",
    );
    return this._entity.mod?.name;
  }

  /** @deprecated use `mod.val` */
  get modVal(): ModifierValue | undefined {
    emitDeprecation(
      "modVal: just for compatibility and can be dropped in future. Instead use 'mod.val'",
    );
    return this._entity.mod?.val;
  }

  /**
   * Stable identifier of the cell, used for equality / set keys.
   *
   * Format: `<entity>[@<layer>][.<tech>]`. Example: `button__text@desktop.css`.
   */
  get id(): string {
    if (this._id) return this._id;

    const layer = this._layer ? `@${this._layer}` : '';
    const tech = this._tech ? `.${this._tech}` : '';
    this._id = `${this._entity}${layer}${tech}`;
    return this._id;
  }

  toString(): string {
    return this.id;
  }

  valueOf(): BemCellRepresentation {
    const res: BemCellRepresentation = { entity: this._entity.valueOf() };
    if (this._tech) res.tech = this._tech;
    if (this._layer) res.layer = this._layer;
    return res;
  }

  toJSON(): BemCellRepresentation {
    return this.valueOf();
  }

  inspect(_depth?: number, options?: Parameters<typeof inspect>[1]): string {
    return `BemCell ${inspect(this.valueOf(), options)}`;
  }

  [inspect.custom](
    _depth?: number,
    options?: Parameters<typeof inspect>[1],
  ): string {
    return `BemCell ${inspect(this.valueOf(), options)}`;
  }

  isEqual(cell: BemCell | null | undefined): boolean {
    if (!cell) return false;
    return (
      cell.tech === this.tech &&
      cell.layer === this.layer &&
      cell.entity.isEqual(this.entity)
    );
  }

  static isBemCell(cell: unknown): cell is BemCell {
    if (cell === null || cell === undefined) return false;
    const c = (cell as { constructor?: unknown }).constructor;
    if (c === BemCell) return true;
    return Boolean(
      c &&
        c !== Object &&
        (cell as { __isBemCell__?: unknown }).__isBemCell__,
    );
  }

  /**
   * Creates `BemCell` from a flexible object.
   *
   * Accepted shapes:
   *  - existing `BemCell` (returned as-is)
   *  - `BemEntityName` (wrapped without tech/layer)
   *  - `{ entity: <entityName-or-options>, tech?, layer? }`
   *  - flat entity options (`{ block, elem?, mod?, val?, tech?, layer? }`)
   */
  static create(obj: BemCellCreateOptions | BemEntityName | BemCell): BemCell {
    if (BemEntityName.isBemEntityName(obj)) {
      return new BemCell({ entity: obj });
    }
    if (BemCell.isBemCell(obj)) {
      return obj;
    }

    const data: BemCellOptions = {
      entity: BemEntityName.create(obj.entity ?? obj),
    };
    if (obj.tech) data.tech = obj.tech;
    if (obj.layer) data.layer = obj.layer;

    return new BemCell(data);
  }
}

export default BemCell;
