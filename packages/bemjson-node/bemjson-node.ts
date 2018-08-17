type NonStrictMods = Record<string, boolean | string | number | undefined>;

/**
 * Object representation of bemjson node.
 */
export interface IBemJsonNodeOptions {
    block: string;
    mods?: NonStrictMods;
    elem?: string;
    elemMods?: NonStrictMods;
    mix?: IBemJsonNodeOptions | IBemJsonNodeOptions[];
}

export class BemjsonNode {

    public block: IBemJsonNodeOptions['block'];
    public mods: NonStrictMods = {};
    public elem: IBemJsonNodeOptions['elem'];
    public elemMods: IBemJsonNodeOptions['elemMods'];
    public mix: BemjsonNode[] = [];
    public __isBemjsonNode__? = true;

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

        this.block = options.block;

        if(options.elem) {
            this.elem = options.elem;
            this.elemMods = {};
        }

        options.mods && Object.assign(this.mods, options.mods);
        options.elemMods && Object.assign(this.elemMods, options.elemMods);

        if (options.mix) {
            this.mix = ([] as BemjsonNode[]).concat(options.mix as BemjsonNode[])
                .map(n => (BemjsonNode.isBemjsonNode(n) ? n
                    : new BemjsonNode(typeof n === 'object' ? n : {block: n})));
        }
    }

    /**
     * Returns normalized object representing the bemjson node.
     *
     * In some browsers `console.log()` calls `valueOf()` on each argument.
     * This method will be called to get custom string representation of the object.
     *
     * @example
     * ``` js
     * const BemjsonNode = require('@bem/sdk.bemjson-node');
     * const node = new BemjsonNode({ block: 'button', mix: { block: x } });
     *
     * node.valueOf();
     *
     * // ➜ { block: 'button', mods: {}, mix: [{ block: 'x' }] }
     * ```
     *
     */
    valueOf() {
        const res: IBemJsonNodeOptions = {
            block: this.block,
            mods: Object.assign({}, this.mods)
        };

        if (this.elem) {
            res.elem = this.elem;
            res.elemMods = Object.assign({}, this.elemMods);
        }

        this.mix.length && (res.mix = this.mix.map(n => n.valueOf()));

        return res;
    }

    /**
     * Returns raw data for `JSON.stringify()` purposes.
     *
     * @example
     * ``` js
     * const BemjsonNode = require('@bem/sdk.bemjson-node');
     *
     * const node = new BemjsonNode({ block: 'input', mods: { available: true } });
     *
     * JSON.stringify(node); // {"block":"input","mods":{"available":true}}
     * ```
     *
     * @returns {BEMSDK.BemjsonNode.Representation}
     */
    toJSON() {
        return this.valueOf();
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
        return this.block + mods(this.mods) +
            (!this.elem ? '' : ' ' + this.block + '__' + this.elem + mods(this.elemMods || {})) +
            (!this.mix.length ? '' : '  ' + this.mix.join('  '));

        function mods(a: NonStrictMods) {
            const pairs = Object.keys(a).map(k => a[k] === true ? [k] : [k, a[k]]);
            return !pairs.length ? '' : ' ' + pairs.map(pair => '_' + pair.join('_')).join(' ');
        }
    }

    /**
     * Determines whether specified argument is instance of BemjsonNode.
     *
     * @example
     * ``` js
     * const BemjsonNode = require('@bem/sdk.bemjson-node');
     *
     * const bemjsonNode = new BemjsonNode({ block: 'input' });
     *
     * BemjsonNode.isBemjsonNode(bemjsonNode); // true
     * BemjsonNode.isBemjsonNode({}); // false
     * ```
     *
     * @param bemjsonNode bemjson node to check.
     * @returns A Boolean indicating whether or not specified argument is instance of BemjsonNode.
     */
    static isBemjsonNode(bemjsonNode: { __isBemjsonNode__?: boolean; [key: string]: any }) {
        return bemjsonNode && bemjsonNode.__isBemjsonNode__;
    }
}
