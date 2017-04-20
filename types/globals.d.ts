declare namespace BEMSDK {
    export namespace EntityName {
        /**
         * Types of BEM entities.
         */
        export type Type = 'block' | 'blockMod' | 'elem' | 'elemMod';
        export type BlockName = string;
        export type ElementName = string;
        export type ModifierName = string;
        export type ModifierValue = string | true;
        export type Id = string;

        /**
         * Abstract object to represent entity name
         */
        interface AbstractRepresentation {
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
        export interface Modifier {
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
        export interface Representation extends AbstractRepresentation {
            /**
             * The modifier of entity.
             */
            mod?: Modifier;
        }

        /**
         * Object to create representation of entity name.
         */
        export interface Options extends AbstractRepresentation {
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
        export interface CreateOptions extends Options {
            /**
             * The modifier value of entity. Used if neither `mod.val` were not specified.
             */
            val?: ModifierValue;
        }
    }
}
