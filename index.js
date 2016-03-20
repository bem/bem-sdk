'use strict';

(function (global) {
/**
 * Enum for types of BEM entities.
 *
 * @readonly
 * @enum {String}
 */
var TYPES = {
    BLOCK:     'block',
    BLOCK_MOD: 'blockMod',
    ELEM:      'elem',
    ELEM_MOD:  'elemMod'
};

/**
 * BemNaming allows getting information about BEM entity using string as well as forming string
 * representation based on BEM-naming.
 *
 * @param {Object} [options]           Options.
 * @param {Object} [options.elem='__'] Separates element's name from block.
 * @param {Object} [options.mod='_']   Separates names and values of modifiers from blocks and elements.
 * @param {Object} [options.wordPattern='[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*] Defines which symbols can be used for block,
 *                                                                       element and modifier's names.
 * @name BemNaming
 * @class
 */
function BemNaming(options) {
    options || (options = {});

    /**
     * String to separate elem from block.
     *
     * @type {String}
     */
    this.elemDelim = options.elem || options.elemSeparator || '__';
    /**
     * String to separate names and values of modifiers from blocks and elements.
     *
     * @type {String}
     */
    this.modDelim = options.mod || options.modSeparator || '_';
    this._wordPattern = options.wordPattern || options.literal && (options.literal + '+') ||
        '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*';

    this._buildRegex();
}

/**
 * Checks a string to be valid BEM notation.
 *
 * @param {String} str String representation of BEM entity.
 * @returns {Boolean}
 */
BemNaming.prototype.validate = function (str) {
    return this._regex.test(str);
};

/**
 * Returns a string indicating the type of the BEM entity.
 *
 * @param {Object|String|undefined} obj BEM-naming object or string representation of BEM entity.
 * @returns {String}
 */
BemNaming.prototype.typeOf = function (obj) {
    if (typeof obj === 'string') {
        obj = this.parse(obj);
    }

    if (!obj || !obj.block) { return undefined; }

    var modName = obj.modName,
        isMod = modName && (obj.modVal || !obj.hasOwnProperty('modVal'));

    if (obj.elem) {
        if (isMod)    { return TYPES.ELEM_MOD; }
        if (!modName) { return TYPES.ELEM;     }
    }

    if (isMod)    { return TYPES.BLOCK_MOD; }
    if (!modName) { return TYPES.BLOCK;     }
};

/**
 * Checks whether BEM-naming object or string is a block.
 *
 * @param {Object|String} obj BEM-naming object or string representation of BEM entity.
 * @returns {Boolean}
 */
BemNaming.prototype.isBlock = function (obj) {
    return this.typeOf(obj) === TYPES.BLOCK;
};

/**
 * Checks whether BEM-naming object or string is modifier of a block.
 *
 * @param {Object|String} obj BEM-naming object or string representation of BEM entity.
 * @returns {Boolean}
 */
BemNaming.prototype.isBlockMod = function (obj) {
    return this.typeOf(obj) === TYPES.BLOCK_MOD;
};

/**
 * Checks whether BEM-naming object or string is element of a block.
 *
 * @param {Object|String} obj BEM-naming object or string representation of BEM entity.
 * @returns {Boolean}
 */
BemNaming.prototype.isElem = function (obj) {
    return this.typeOf(obj) === TYPES.ELEM;
};

/**
 * Checks whether BEM-naming object or string is element of a block.
 *
 * @param {Object|String} obj BEM-naming object or string representation of BEM entity.
 * @returns {Boolean}
 */
BemNaming.prototype.isElemMod = function (obj) {
    return this.typeOf(obj) === TYPES.ELEM_MOD;
};

/**
 * Parses string into BEM-naming.
 *
 * @param {String} str String representation of BEM entity.
 * @returns {Object|undefined}
 */
BemNaming.prototype.parse = function (str) {
    var executed = this._regex.exec(str);

    if (!executed) { return undefined; }

    var notation = {
            block: executed[1] || executed[4]
        },
        elem = executed[5],
        modName = executed[2] || executed[6];

    elem && (notation.elem = elem);

    if (modName) {
        var modVal = executed[3] || executed[7];

        notation.modName = modName;
        notation.modVal = modVal || true;
    }

    return notation;
};

/**
 * Forms a string according to BEM-naming object.
 *
 * @param {Object} obj BEM-naming object
 * @returns {String}
 */
BemNaming.prototype.stringify = function (obj) {
    if (!obj || !obj.block) {
        return undefined;
    }

    var res = obj.block;

    if (obj.elem) {
        res += this.elemDelim + obj.elem;
    }

    if (obj.modName) {
        var modVal = obj.modVal;

        if (modVal || modVal === 0 || !obj.hasOwnProperty('modVal')) {
            res += this.modDelim + obj.modName;
        }

        if (modVal && modVal !== true) {
            res += this.modDelim + modVal;
        }
    }

    return res;
};

BemNaming.prototype._buildRegex = function () {
    var word = this._wordPattern,
        block = '(' + word + ')',
        elem = '(?:' + this.elemDelim + '(' + word + '))?',
        modPart = '(?:' + this.modDelim + '(' + word + '))?',
        mod = modPart + modPart;

    this._regex = new RegExp('^' + block + mod + '$|^' + block + elem + mod + '$');
};

var defineAsGlobal = true,
    cache = {},
    methods = [
        'validate', 'typeOf',
        'parse', 'stringify',
        'isBlock', 'isElem', 'isBlockMod', 'isElemMod'
    ],
    bemNaming = function (options) {
        options || (options = {});

        var naming = {
                elem: options.elem || '__',
                mod: options.mod || '_',
                wordPattern: options.wordPattern || '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*'
            },
            id = JSON.stringify(naming);

        if (cache[id]) {
            return cache[id];
        }

        var instance = new BemNaming(naming),
            namespace = {};

        methods.forEach(function (method) {
            namespace[method] = instance[method].bind(instance);
        });
        cache[id] = namespace;

        return namespace;
    },
    originalNaming = bemNaming();

methods.forEach(function (method) {
    bemNaming[method] = originalNaming[method];
});

// Node.js
/* istanbul ignore if */
if (typeof exports === 'object') {
    module.exports = bemNaming;
    defineAsGlobal = false;
}

// YModules
/* istanbul ignore if */
if (typeof modules === 'object') {
    modules.define('bem-naming', function (provide) {
        provide(bemNaming);
    });
    defineAsGlobal = false;
}

// AMD
/* istanbul ignore if */
if (typeof define === 'function') {
    define(function (require, exports, module) {
        module.exports = bemNaming;
    });
    defineAsGlobal = false;
}

/* istanbul ignore next */
defineAsGlobal && (global.bemNaming = bemNaming);
})(this);
