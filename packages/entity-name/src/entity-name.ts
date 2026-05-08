import { inspect } from 'node:util';

import { stringifyWrapper } from '@bem/sdk.naming.entity.stringify';
import { origin } from '@bem/sdk.naming.presets';

import { deprecate } from './deprecate.js';
import { EntityTypeError } from './entity-type-error.js';
import type {
  BlockName,
  ElementName,
  EntityNameCreateOptions,
  EntityNameOptions,
  EntityRepresentation,
  EntityType,
  Id,
  Modifier,
  ModifierName,
  ModifierValue,
} from './types.js';

const stringifyEntity = stringifyWrapper(origin);

const TYPES = {
  BLOCK: 'block',
  BLOCK_MOD: 'blockMod',
  ELEM: 'elem',
  ELEM_MOD: 'elemMod',
} as const satisfies Record<string, EntityType>;

const normalizeValue = (v: ModifierValue): ModifierValue =>
  (v as unknown) === 0 ? '0' : v;

interface MutableEntity extends EntityRepresentation {
  mod?: Modifier;
}

export class BemEntityName {
  /** @internal */
  readonly __isBemEntityName__ = true as const;

  /** @internal */
  private readonly _data!: MutableEntity;

  /** @internal */
  private _type?: EntityType;

  /** @internal */
  private _scope?: BemEntityName | null;

  /** @internal */
  private _id?: Id;

  constructor(obj: EntityNameOptions | BemEntityName) {
    if (obj instanceof BemEntityName) {
      return obj;
    }

    if (!obj || !obj.block) {
      throw new EntityTypeError(obj, 'the field `block` is undefined');
    }

    const isFromInstance = obj.__isBemEntityName__ === true;

    if (!isFromInstance) {
      if (obj.modName) deprecate(obj, 'modName', 'mod.name');
      if (obj.modVal) deprecate(obj, 'modVal', 'mod.val');
    }

    const data: MutableEntity = { block: obj.block };

    if (obj.elem) {
      data.elem = obj.elem;
    }

    const modObj = obj.mod;
    const modName: ModifierName | undefined =
      (typeof modObj === 'string' ? modObj : modObj && modObj.name) ||
      (!isFromInstance ? obj.modName : undefined) ||
      undefined;

    const hasModVal =
      (typeof modObj === 'object' &&
        modObj !== null &&
        Object.prototype.hasOwnProperty.call(modObj, 'val')) ||
      Object.prototype.hasOwnProperty.call(obj, 'modVal');

    if (modName) {
      const rawVal = hasModVal
        ? (typeof modObj === 'object' && modObj
            ? normalizeValue(modObj.val as ModifierValue)
            : undefined) ?? normalizeValue(obj.modVal as ModifierValue)
        : true;

      if (rawVal) {
        data.mod = { name: modName, val: rawVal };
      }
    } else if (modObj || hasModVal) {
      throw new EntityTypeError(obj, 'the field `mod.name` is undefined');
    }

    this._data = data;
  }

  get block(): BlockName {
    return this._data.block;
  }

  get elem(): ElementName | undefined {
    return this._data.elem;
  }

  get mod(): Modifier | undefined {
    return this._data.mod;
  }

  /** @deprecated use `mod.name` */
  get modName(): ModifierName | undefined {
    deprecate(this, 'modName', 'mod.name');
    return this.mod?.name;
  }

  /** @deprecated use `mod.val` */
  get modVal(): ModifierValue | undefined {
    deprecate(this, 'modVal', 'mod.val');
    return this.mod?.val;
  }

  get type(): EntityType {
    if (this._type) return this._type;
    const data = this._data;
    const isMod = Boolean(data.mod);
    this._type = data.elem
      ? isMod
        ? TYPES.ELEM_MOD
        : TYPES.ELEM
      : isMod
        ? TYPES.BLOCK_MOD
        : TYPES.BLOCK;
    return this._type;
  }

  get scope(): BemEntityName | null {
    if (this.type === TYPES.BLOCK) return null;
    if (this._scope !== undefined) return this._scope;

    const scopeOpts: EntityNameOptions = { block: this.block };
    if (this.type === TYPES.ELEM_MOD && this.elem) {
      scopeOpts.elem = this.elem;
    }
    this._scope = new BemEntityName(scopeOpts);
    return this._scope;
  }

  get id(): Id {
    if (this._id !== undefined) return this._id;
    this._id = stringifyEntity(this._data);
    return this._id;
  }

  isSimpleMod(): boolean | null {
    return this.mod ? this.mod.val === true : null;
  }

  isEqual(entityName: BemEntityName | null | undefined): boolean {
    return Boolean(entityName) && this.id === entityName!.id;
  }

  belongsTo(entityName: BemEntityName): boolean {
    if (entityName.block !== this.block) return false;

    return (
      (entityName.type === TYPES.BLOCK &&
        (this.type === TYPES.BLOCK_MOD || this.type === TYPES.ELEM)) ||
      (entityName.elem === this.elem &&
        entityName.type === TYPES.ELEM &&
        this.type === TYPES.ELEM_MOD)
    );
  }

  valueOf(): EntityRepresentation {
    return this._data;
  }

  toJSON(): EntityRepresentation {
    return this._data;
  }

  toString(): string {
    return this.id;
  }

  /**
   * Custom representation for `util.inspect()`.
   *
   * Note: classic `inspect()` method is preserved for compatibility with
   * old Node debuggers; modern Node uses `util.inspect.custom`. We expose
   * both to keep the previous output stable.
   */
  inspect(_depth?: number, options?: Parameters<typeof inspect>[1]): string {
    const stringRepresentation = inspect(this._data, options);
    return `BemEntityName ${stringRepresentation}`;
  }

  [inspect.custom](
    _depth?: number,
    options?: Parameters<typeof inspect>[1],
  ): string {
    const stringRepresentation = inspect(this._data, options);
    return `BemEntityName ${stringRepresentation}`;
  }

  static create(
    obj: EntityNameCreateOptions | BlockName | BemEntityName,
  ): BemEntityName {
    if (BemEntityName.isBemEntityName(obj)) {
      return obj;
    }

    const opts: EntityNameCreateOptions =
      typeof obj === 'string' ? { block: obj } : obj;

    const data: EntityNameOptions = { block: opts.block };
    const mod = opts.mod;

    if (opts.elem) data.elem = opts.elem;

    if (mod || opts.modName) {
      const isString = typeof mod === 'string';
      const modName = (isString ? mod : mod?.name) || opts.modName;
      const sourceVal =
        !isString && mod && 'val' in mod && mod.val !== undefined
          ? mod.val
          : opts.val !== undefined
            ? opts.val
            : opts.modVal !== undefined
              ? opts.modVal
              : true;

      data.mod = {
        name: modName as ModifierName,
        val: sourceVal,
      };
    }

    return new BemEntityName(data);
  }

  static isBemEntityName(entityName: unknown): entityName is BemEntityName {
    if (entityName === null || entityName === undefined) return false;
    const c = (entityName as { constructor?: unknown }).constructor;
    if (c === BemEntityName) return true;
    return Boolean(
      c &&
        c !== Object &&
        (entityName as { __isBemEntityName__?: unknown }).__isBemEntityName__,
    );
  }
}

export default BemEntityName;
