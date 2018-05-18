declare module '@bem/sdk.entity-name' {
    export default class BemEntityName {
        constructor(obj: EntityName.IOptions);

        readonly block: EntityName.BlockName;
        readonly elem: EntityName.ElementName | undefined;
        readonly mod: EntityName.IModifier | undefined;
        readonly modName: EntityName.ModifierName | undefined;
        readonly modVal: EntityName.ModifierValue | undefined;
        readonly type: EntityName.Type;
        readonly scope: BemEntityName | null;
        readonly id: EntityName.Id;

        isSimpleMod(): boolean | null;
        isEqual(entityName: BemEntityName): boolean;
        belongsTo(entityName: BemEntityName): boolean;
        valueOf(): EntityName.IRepresentation;
        toJSON(): EntityName.IRepresentation;
        toString(): string;
        inspect(depth: number, options: object): string;

        static create(obj: EntityName.ICreateOptions | string): BemEntityName;
        static isBemEntityName(entityName: any): boolean;
    }

    export namespace EntityName {
        /**
         * Types of BEM entities.
         */
        export type Type = 'block' | 'blockMod' | 'elem' | 'elemMod';
        export type BlockName = string;
        export type ElementName = string;
        export type ModifierName = string;
        export type ModifierValue = string | boolean;
        export type Id = string;

        /**
         * Abstract object to represent entity name
         */
        interface IAbstractRepresentation {
            /**
             * The block name of entity.
             */
            block: BlockName;
            /**
             * The element name of entity.
             */
            elem?: ElementName;
            mod?: any;
        }

        /**
         * Object to represent modifier of entity name.
         */
        export interface IModifier {
            /**
             * The modifier name of entity.
             */
            name: ModifierName;
            /**
             * The modifier value of entity.
             */
            val: ModifierValue;
        }

        /**
         * Strict object to represent entity name.
         */
        export interface IRepresentation extends IAbstractRepresentation {
            /**
             * The modifier of entity.
             */
            mod?: IModifier;
        }

        /**
         * Object to create representation of entity name.
         */
        export interface IOptions extends IAbstractRepresentation {
            /**
             * The modifier of entity.
             */
            mod?: ModifierName | {
                /**
                 * The modifier name of entity.
                 */
                name: ModifierName;
                /**
                 * The modifier value of entity.
                 */
                val?: ModifierValue;
            };
            /**
             * The modifier name of entity. Used if `mod.name` wasn't specified.
             * @deprecated use `mod.name` instead.
             */
            modName?: ModifierName;
            /**
             * The modifier value of entity. Used if neither `mod.val` nor `val` were not specified.
             * @deprecated use `mod.name` instead.
             */
            modVal?: ModifierValue;
        }

        /**
         * Object to create representation of entity name with `create` method.
         *
         * Contains old field: `val`, `modName` and `modVal.
         */
        export interface ICreateOptions extends IOptions {
            /**
             * The modifier value of entity. Used if neither `mod.val` were not specified.
             */
            val?: ModifierValue;
        }
    }
}
