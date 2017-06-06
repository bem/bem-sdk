'use strict';

const assert = require('assert');
const util = require('util');

class BemjsonNode {
    /**
     * @param {BEMSDK.BemjsonNode.Options} obj — object representation of bemjson node.
     */
    constructor(obj) {
        assert(obj.block && typeof obj.block === 'string',
            '@bem/bemjson-node: `block` field should be a non empty string');
        assert(!obj.elem || obj.elem && typeof obj.elem === 'string',
            '@bem/bemjson-node: `elem` field should be a non-empty string.');
        assert(!obj.elemMods || obj.elem && obj.elemMods,
            '@bem/bemjson-node: `elemMods` field should not be used without `elem` field.');
        assert(!obj.mods || typeof obj.mods === 'object',
            '@bem/bemjson-node: `mods` field should be a simple object or null.');
        assert(!obj.elemMods || typeof obj.elemMods === 'object',
            '@bem/bemjson-node: `elemMods` field should be a simple object or null.');

        const data = this.data_ = {
            block: obj.block,
            elem: null,
            mods: {},
            elemMods: null,
            mix: []
        };

        obj.elem && (data.elem = obj.elem, data.elemMods = {});
        obj.mods && Object.assign(data.mods, obj.mods);
        obj.elemMods && Object.assign(data.elemMods, obj.elemMods);

        if (obj.mix) {
            data.mix = [].concat(obj.mix)
                .map(n => (BemjsonNode.isBemjsonNode(n) ? n
                    : new BemjsonNode(typeof n === 'object' ? n : {block: n})));
        }

        this.__isBemjsonNode__ = true;
    }

    /**
     * Returns the block name of bemjson node.
     *
     * @example
     * const BemjsonNode = require('@bem/bemjson-node');
     * const node = new BemjsonNode({ block: 'button' });
     *
     * node.block; // button
     *
     * @returns {BEMSDK.BemjsonNode.BlockName} name of node block.
     */
    get block() { return this.data_.block; }

    /**
     * Returns the element name of bemjson node.
     *
     * If node's entity is not an element then returns null.
     *
     * @example
     * const BemjsonNode = require('@bem/bemjson-node');
     * const node = new BemjsonNode({ block: 'button', elem: 'text' });
     *
     * node.elem; // text
     *
     * @returns {?BEMSDK.BemjsonNode.ElementName} - name of node element.
     */
    get elem() { return this.data_.elem; }

    /**
     * Returns modifiers of block entity of bemjson node (or of a scope).
     *
     * @example
     * const BemjsonNode = require('@bem/bemjson-node');
     * const node = new BemjsonNode({ block: 'button', mods: { m: 'v' }, elem: 'text' });
     *
     * node.mods; // { m: 'v' }
     *
     * @returns {BEMSDK.BemjsonNode.Modifiers} map of modifiers.
     */
    get mods() { return this.data_.mods; }

    /**
     * Returns modifiers of element entity of bemjson node or null if there is no element.
     *
     * @example
     * const BemjsonNode = require('@bem/bemjson-node');
     * const node = new BemjsonNode({ block: 'button', elem: 'e', elemMods: { m: 'v' } });
     *
     * node.elemMods; // { m: 'v' }
     *
     * @returns {?BEMSDK.BemjsonNode.Modifiers} map of modifiers.
     */
    get elemMods() { return this.data_.elemMods; }

    /**
     * Returns array of mixed bemjson nodes to the current one.
     *
     * @returns {Array.<BemjsonNode>} - Array of BemjsonNode items.
     */
    get mix() {
        return this.data_.mix;
    }

    /**
     * Returns normalized object representing the bemjson node.
     *
     * In some browsers `console.log()` calls `valueOf()` on each argument.
     * This method will be called to get custom string representation of the object.
     *
     * @example
     * const BemjsonNode = require('@bem/bemjson-node');
     * const node = new BemjsonNode({ block: 'button', mix: { block: x } });
     *
     * node.valueOf();
     *
     * // ➜ { block: 'button', mods: {}, mix: [{ block: 'x' }] }
     *
     * @returns {BEMSDK.BemjsonNode.Representation}
     */
    valueOf() {
        const res = {};
        const d = this.data_;

        res.block = d.block;
        res.mods = Object.assign({}, d.mods);
        d.elem && (
            res.elem = d.elem,
            res.elemMods = Object.assign({}, d.elemMods)
        );
        d.mix.length && (res.mix = d.mix.map(n => n.valueOf()));

        return res;
    }

    /**
     * Returns raw data for `JSON.stringify()` purposes.
     *
     * @example
     * const BemjsonNode = require('@bem/bemjson-node');
     *
     * const node = new BemjsonNode({ block: 'input', mods: { available: true } });
     *
     * JSON.stringify(node); // {"block":"input","mods":{"available":true}}
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
     * const BemjsonNode = require('@bem/bemjson-node');
     * const node = new BemjsonNode({ block: 'button', mod: 'focused' });
     *
     * node.toString(); // button_focused
     *
     * @returns {string}
     */
    toString() {
        const d = this.data_;

        return d.block + mods(d.mods) +
            (!d.elem ? '' : ' ' + d.block + '__' + d.elem + mods(d.elemMods)) +
            (!d.mix.length ? '' : '  ' + d.mix.join('  '));

        function mods(a) {
            const pairs = Object.keys(a).map(k => a[k] === true ? [k] : [k, a[k]]);
            return !pairs.length ? '' : ' ' + pairs.map(pair => '_' + pair.join('_')).join(' ');
        }
    }

    /**
     * Returns object representing the bemjson node. Is needed for debug in Node.js.
     *
     * In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.
     * This method will be called to get custom string representation of the object.
     *
     * @example
     * const BemjsonNode = require('@bem/bemjson-node');
     * const node = new BemjsonNode({ block: 'button' });
     *
     * console.log(name); // BemjsonNode { block: 'button' }
     *
     * @param {number} depth — tells inspect how many times to recurse while formatting the object.
     * @param {object} options — An optional `options` object may be passed
     *   that alters certain aspects of the formatted string.
     *
     * @returns {string}
     */
    inspect(depth, options) {
        const stringRepresentation = util.inspect(this.data_, options);

        return `BemjsonNode ${stringRepresentation}`;
    }

    /**
     * Determines whether specified argument is instance of BemjsonNode.
     *
     * @example
     * const BemjsonNode = require('@bem/bemjson-node');
     *
     * const bemjsonNode = new BemjsonNode({ block: 'input' });
     *
     * BemjsonNode.isBemjsonNode(bemjsonNode); // true
     * BemjsonNode.isBemjsonNode({}); // false
     *
     * @param {*} bemjsonNode - bemjson node to check.
     * @returns {boolean} A Boolean indicating whether or not specified argument is instance of BemjsonNode.
     */
    static isBemjsonNode(bemjsonNode) {
        return bemjsonNode && bemjsonNode.__isBemjsonNode__;
    }
}

module.exports = BemjsonNode;

// TypeScript imports the `default` property for
// an ES2015 default import (`import BemjsonNode from '@bem/bemjson-node'`)
// See: https://github.com/Microsoft/TypeScript/issues/2242#issuecomment-83694181
module.exports.default = BemjsonNode;
