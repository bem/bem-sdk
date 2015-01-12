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
 * BEMNaming allows getting information about BEM entity using string as well as forming string
 * representation based on BEM-naming.
 *
 * @param {Object} [options]
 * @param {Object} [options.elem='__'] Separates element's name from block.
 * @param {Object} [options.mod='_']   Separates names and values of modifiers from blocks and elements.
 * @param {Object} [options.wordPattern='[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*] Defines which symbols can be used for block,
 *                                                                       element and modifier's names.
 * @name BEMNaming
 * @class
 */
function BEMNaming(options) {
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
BEMNaming.prototype.validate = function (str) {
    return this._regex.test(str);
};

/**
 * Returns a string indicating the type of the BEM entity.
 *
 * @param {Object|String} obj BEM-naming object or string representation of BEM entity.
 * @returns {String}
 */
BEMNaming.prototype.typeOf = function (obj) {
    if (typeof obj === 'string') {
        obj = this.parse(obj);
    }

    if (!obj || !obj.block) return;

    var modName = obj.modName,
        isMod = modName && (obj.modVal || !obj.hasOwnProperty('modVal'));

    if (obj.elem) {
        if (isMod) return TYPES.ELEM_MOD;
        if (!modName) return TYPES.ELEM;
    }

    if (isMod) return TYPES.BLOCK_MOD;
    if (!modName) return TYPES.BLOCK;
};

/**
 * Checks whether BEM-naming object or string is a block.
 *
 * @param {Object|String} obj BEM-naming object or string representation of BEM entity.
 * @returns {Boolean}
 */
BEMNaming.prototype.isBlock = function (obj) {
    return this.typeOf(obj) === TYPES.BLOCK;
};

/**
 * Checks whether BEM-naming object or string is modifier of a block.
 *
 * @param {Object|String} obj BEM-naming object or string representation of BEM entity.
 * @returns {Boolean}
 */
BEMNaming.prototype.isBlockMod = function (obj) {
    return this.typeOf(obj) === TYPES.BLOCK_MOD;
};

/**
 * Checks whether BEM-naming object or string is element of a block.
 *
 * @param {Object|String} obj BEM-naming object or string representation of BEM entity.
 * @returns {Boolean}
 */
BEMNaming.prototype.isElem = function (obj) {
    return this.typeOf(obj) === TYPES.ELEM;
};

/**
 * Checks whether BEM-naming object or string is element of a block.
 *
 * @param {Object|String} obj BEM-naming object or string representation of BEM entity.
 * @returns {Boolean}
 */
BEMNaming.prototype.isElemMod = function (obj) {
    return this.typeOf(obj) === TYPES.ELEM_MOD;
};

/**
 * Parses string into BEM-naming.
 *
 * @param {String} str String representation of BEM entity.
 * @returns {Object|undefined}
 */
BEMNaming.prototype.parse = function (str) {
    var executed = this._regex.exec(str);

    if (!executed) return;

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
BEMNaming.prototype.stringify = function (obj) {
    if (!obj || !obj.block) {
        throw new Error('The field `block` is undefined. It is impossible to stringify BEM notation.');
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

BEMNaming.prototype._buildRegex = function () {
    var word = this._wordPattern,
        block = '(' + word + ')',
        elem = '(?:' + this.elemDelim + '(' + word + '))?',
        modPart = '(?:' + this.modDelim + '(' + word + '))?',
        mod = modPart + modPart;

    this._regex = new RegExp('^' + block + mod + '$|^' + block + elem + mod + '$');
};

var defineAsGlobal = true,
    cache = {},
    bemNaming = function (options) {
        options || (options = {});

        var naming = {
                elem: options.elem || options.elemSeparator || '__',
                mod: options.mod || options.modSeparator || '_',
                wordPattern: options.wordPattern || options.literal && (options.literal + '+') ||
                    '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*'
            },
            id = JSON.stringify(naming);

        return cache[id] || (cache[id] = new BEMNaming(naming));
    },
    originalNaming = bemNaming();

bemNaming.BEMNaming  = BEMNaming;
bemNaming.validate   = function () { return originalNaming.validate.apply(originalNaming, arguments);   };
bemNaming.parse      = function () { return originalNaming.parse.apply(originalNaming, arguments);      };
bemNaming.stringify  = function () { return originalNaming.stringify.apply(originalNaming, arguments);  };
bemNaming.typeOf     = function () { return originalNaming.typeOf.apply(originalNaming, arguments);     };
bemNaming.isBlock    = function () { return originalNaming.isBlock.apply(originalNaming, arguments);    };
bemNaming.isElem     = function () { return originalNaming.isElem.apply(originalNaming, arguments);     };
bemNaming.isBlockMod = function () { return originalNaming.isBlockMod.apply(originalNaming, arguments); };
bemNaming.isElemMod  = function () { return originalNaming.isElemMod.apply(originalNaming, arguments);  };

// Node.js
if (typeof exports === 'object') {
    module.exports = bemNaming;
    defineAsGlobal = false;
}

// YModules
if (typeof modules === 'object') {
    modules.define('bem-naming', function (provide) {
        provide(bemNaming);
    });
    defineAsGlobal = false;
}

// AMD
if (typeof define === 'function') {
    define(function (require, exports, module) {
        module.exports = bemNaming;
    });
    defineAsGlobal = false;
}

defineAsGlobal && (global.bemNaming = bemNaming);
})(this);
