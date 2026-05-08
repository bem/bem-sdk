/**
 * Types of BEM entities.
 */
export type EntityType = 'block' | 'blockMod' | 'elem' | 'elemMod';

export type BlockName = string;
export type ElementName = string;
export type ModifierName = string;
export type ModifierValue = string | boolean;
export type Id = string;

/**
 * Modifier of an entity.
 */
export interface Modifier {
  name: ModifierName;
  val: ModifierValue;
}

/**
 * Strict object representation of an entity name.
 */
export interface EntityRepresentation {
  block: BlockName;
  elem?: ElementName;
  mod?: Modifier;
}

/**
 * Object accepted by `new BemEntityName(obj)`.
 */
export interface EntityNameOptions {
  block: BlockName;
  elem?: ElementName;
  mod?:
    | ModifierName
    | {
        name: ModifierName;
        val?: ModifierValue;
      };
  /** @deprecated use `mod.name` */
  modName?: ModifierName;
  /** @deprecated use `mod.val` */
  modVal?: ModifierValue;
  /** Internal marker — set on instances; reading it from a plain object opts out of legacy field handling. */
  __isBemEntityName__?: boolean;
}

/**
 * Object accepted by `BemEntityName.create(obj)`.
 */
export interface EntityNameCreateOptions extends EntityNameOptions {
  /** Shortcut for `mod.val` when `mod` is given as a string. */
  val?: ModifierValue;
}
