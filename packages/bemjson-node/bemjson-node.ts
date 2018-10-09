import * as namingPresets from '@bem/sdk.naming.presets';
import { INamingConvention } from '@bem/sdk.naming.presets';
import { stringifyWrapper } from '@bem/sdk.naming.entity.stringify';

export type NonStrictMods = Record<string, boolean | string | number | undefined>;
export type EntityName = { block: string, elem?: string, mod?: { name: string; val: true | string | number }};
export type EntityMods = Array<{ block: string, elem?: string, mod: { name: string; val: true | string }}>;

/**
 * Object representation of bemjson node.
 */
export interface IBemJsonNodeOptions {
    block: string;
    mods?: NonStrictMods;
    elem?: string;
    elemMods?: NonStrictMods;
    mix?: IBemJsonNodeOptions | IBemJsonNodeOptions[];
    naming?: INamingConvention;
}

export class BemjsonNode {
    public block: IBemJsonNodeOptions['block'];
    public mods: EntityMods = [];
    public elem: IBemJsonNodeOptions['elem'];
    public elemMods: EntityMods = [];
    public mix: BemjsonNode[] = [];
    public naming: INamingConvention = namingPresets.origin;

    constructor(options: IBemJsonNodeOptions) {
        console.assert(options.block && typeof options.block === 'string',
            '@bem/sdk.bemjson-node: `block` field should be a non empty string');
        console.assert(!options.elem || options.elem && typeof options.elem === 'string',
            '@bem/sdk.bemjson-node: `elem` field should be a non-empty string.');
        console.assert(!options.elemMods || options.elem && options.elemMods,
            '@bem/sdk.bemjson-node: `elemMods` field should not be used without `elem` field.');
        console.assert(!options.mods || typeof options.mods === 'object',
            '@bem/sdk.bemjson-node: `mods` field should be a simple object or null.');
        console.assert(!options.elemMods || typeof options.elemMods === 'object',
            '@bem/sdk.bemjson-node: `elemMods` field should be a simple object or null.');

        if (options.naming) {
            this.naming = options.naming;
        }

        this.block = options.block;

        if (options.elem) {
            this.elem = options.elem;
        }

        if (options.mods) {
            this.mods = this.normalizeMods(options.mods);
        }

        if (options.elemMods) {
            this.elemMods = this.normalizeMods(options.elemMods);
        }

        if (options.mix) {
            this.mix = ([] as IBemJsonNodeOptions[]).concat(options.mix as IBemJsonNodeOptions[])
                .map(n => (new BemjsonNode(typeof n === 'object' ? n : {block: n})));
        }
    }

    /**
     * Returns string representing the bemjson node.
     *
     * Important: If you want to get string representation in accordance with the provisions naming convention
     * you should use `@bem/naming` package.
     *
     * @example
     * ``` js
     * const BemjsonNode = require('@bem/sdk.bemjson-node');
     * const node = new BemjsonNode({ block: 'button', mod: 'focused' });
     *
     * node.toString(); // button_focused
     * ```
     *
     * @returns {string}
     */
    toString() {
        let className = [
            { block: this.block, elem: this.elem },
            ...this.mods,
            ...this.elemMods
        ].map(stringifyWrapper(this.naming)).join(' ');

        if (this.mix.length) {
            className += ' ' + this.mix.join(' ');
        }

        return className;
    }

    protected normalizeMods(mods: NonStrictMods) {
        const normalized: EntityMods = [];
        for (const modName in mods) {
            if (mods[modName] || mods[modName] === 0) {
                normalized.push({
                    block: this.block,
                    elem: this.elem,
                    mod: {
                        name: modName,
                        val: mods[modName] === true ? true : String(mods[modName])
                    }
                });
            }
        }

        return normalized;
    }
}
