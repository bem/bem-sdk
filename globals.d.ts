declare namespace BemSDK {
    export namespace EntityName {
        /**
         * Types of BEM entities.
         */
        export type TYPE = 'block' | 'blockMod' | 'elem' | 'elemMod';

        /**
         * Abstract object to represent entity name
         */
        interface AbstractEntityRepresentation {
            /**
             * The block name of entity.
             */
            block: string;
            /**
             * The element name of entity.
             */
            elem?: string;
            mod?: any;
        }

        /**
         * Object to represent modifier of entity name.
         */
        export interface ModifierRepresentation {
            /**
             * The modifier name of entity.
             */
            name: string;
            /**
             * The modifier value of entity.
             */
            val: string | true;
        }

        /**
         * Strict object to represent entity name.
         */
        export interface StrictRepresentation extends AbstractEntityRepresentation {
            /**
             * The modifier of entity.
             */
            mod?: ModifierRepresentation;
        }

        /**
         * Object to create representation of entity name.
         */
        export interface Options extends AbstractEntityRepresentation {
            /**
             * The modifier of entity.
             */
            mod?: string | {
                /**
                 * The modifier name of entity.
                 */
                name: string;
                /**
                 * The modifier value of entity.
                 */
                val?: string | boolean;
            };
            /**
             * The modifier name of entity. Used if `mod.name` wasn't specified.
             * @deprecated use `mod.name` instead.
             */
            modName?: string;
            /**
             * The modifier value of entity. Used if neither `mod.val` nor `val` were not specified.
             * @deprecated use `mod.name` instead.
             */
            modVal?: string;
        }

        /**
         * Non-strict object to represent entity name.
         *
         * Contains old field: `val`, `modName` and `modVal.
         */
        export interface NonStrictRepresentation extends AbstractEntityRepresentation {
            /**
             * The modifier of entity.
             */
            mod?: string | {
                /**
                 * The modifier name of entity.
                 */
                name: string;
                /**
                 * The modifier value of entity.
                 */
                val?: string | boolean;
            };
            /**
             * The modifier value of entity. Used if neither `mod.val` were not specified.
             */
            val?: string;
            /**
             * The modifier name of entity. Used if `mod.name` wasn't specified.
             */
            modName?: string;
            /**
             * The modifier value of entity. Used if neither `mod.val` nor `val` were not specified.
             */
            modVal?: string;
        }
    }
}
