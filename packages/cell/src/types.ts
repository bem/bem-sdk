import type {
  BemEntityName,
  BlockName,
  ElementName,
  EntityNameCreateOptions,
  Modifier,
  ModifierName,
  ModifierValue,
} from '@bem/sdk.entity-name';

export type Tech = string;
export type Layer = string;

/**
 * Object accepted by `new BemCell(obj)`.
 */
export interface BemCellOptions {
  entity: BemEntityName;
  tech?: Tech;
  layer?: Layer;
}

/**
 * Object accepted by `BemCell.create(obj)`.
 *
 * Either provide a nested `entity` field or flat `block`/`elem`/`mod` fields.
 * `block` is therefore optional at the type level — `BemEntityName.create`
 * still validates that one of the two shapes is present at runtime.
 */
export interface BemCellCreateOptions extends Omit<EntityNameCreateOptions, 'block'> {
  block?: EntityNameCreateOptions['block'];
  /** Technology of cell. */
  tech?: Tech;
  /** Layer of cell. */
  layer?: Layer;
  /**
   * Nested entity options. When provided, takes precedence over flat
   * `block`/`elem`/`mod` fields on the same object.
   */
  entity?: EntityNameCreateOptions | BemEntityName;
}

/**
 * Plain-object representation of a `BemCell`.
 */
export interface BemCellRepresentation {
  entity: { block: BlockName; elem?: ElementName; mod?: Modifier };
  tech?: Tech;
  layer?: Layer;
}

export type {
  BemEntityName,
  BlockName,
  ElementName,
  Modifier,
  ModifierName,
  ModifierValue,
};
