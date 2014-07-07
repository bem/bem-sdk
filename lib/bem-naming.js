(function (global) {

var LITERAL = '[a-zA-Z0-9-]',
    MOD_SEPARATOR = '_',
    ELEM_SEPARATOR = '__';

var BEMNaming = function (options) {
    options || (options = {});

    this._modSeparator = options.modSeparator || MOD_SEPARATOR;
    this._elemSeparator = options.elemSeparator || ELEM_SEPARATOR;
    this._literal = options.literal || LITERAL;

    this._buildRegex();
};

BEMNaming.prototype.validate = function (str) {
    return this._regex.test(str);
};

BEMNaming.prototype.isBlock = function (obj) {
    obj = this._parse(obj);

    return !!obj.block && !obj.modName && !obj.elem;
};

BEMNaming.prototype.isBlockMod = function (obj) {
    obj = this._parse(obj);

    return !!(obj.block && obj.modName && obj.modName && obj.hasOwnProperty('modVal')) && !obj.elem;
};

BEMNaming.prototype.isElem = function (obj) {
    obj = this._parse(obj);

    return !!(obj.block && obj.elem) && !obj.modName;
};

BEMNaming.prototype.isElemMod = function (obj) {
    obj = this._parse(obj);

    return !!(obj.block && obj.elem && obj.modName && obj.hasOwnProperty('modVal'));
};

BEMNaming.prototype.parse = function (str) {
    var executed = this._regex.exec(str);

    if (!executed) {
        return undefined;
    }

    var elem = executed[5],
        modName = executed[2] || executed[6],
        modVal = executed[3] || executed[7],
        notation = {};

    if (modName && (modVal === undefined)) {
        modVal = true;
    }

    notation.block = executed[1] || executed[4];
    elem && (notation.elem = elem);
    modName && (notation.modName = modName);
    modVal && (notation.modVal = modVal);

    return notation;
};

BEMNaming.prototype.stringify = function (obj) {
    if (!obj || !obj.block) {
        throw new Error('The field `block` is undefined. It is impossible to stringify BEM notation.');
    }

    var buf = [obj.block];

    if (obj.elem) {
        buf.push(this._elemSeparator + obj.elem);
    }

    if (obj.modName) {
        if (!obj.hasOwnProperty('modVal')) {
            throw new Error('The field `modVal` is not specified. It is impossible to stringify BEM notation.');
        }

        if (obj.modVal !== undefined && obj.modVal !== null && obj.modVal !== false) {
            buf.push(this._modSeparator + obj.modName);
        }

        if (obj.modVal && obj.modVal !== true) {
            buf.push(this._modSeparator + obj.modVal);
        }
    }

    return buf.join('');
};

BEMNaming.prototype._buildRegex = function () {
    var word = this._literal + '+',
        block = '(' + word + ')',
        mod = '(?:' + this._modSeparator + '(' + word + '))?',
        elem = '(?:' + this._elemSeparator + '(' + word + '))?';

    this._regex = new RegExp(['^', block, mod, mod, '$|^', block, elem, mod, mod, '$'].join(''));
};

BEMNaming.prototype._parse = function (obj) {
    if (typeof obj === 'string') {
        return this.parse(obj);
    }

    return obj || {};
};

var defineAsGlobal = true,
    originalNaming = new BEMNaming(),
    bemNaming = {
        BEMNaming:  BEMNaming,
        validate:   function () { return originalNaming.validate.apply(originalNaming, arguments);   },
        parse:      function () { return originalNaming.parse.apply(originalNaming, arguments);      },
        stringify:  function () { return originalNaming.stringify.apply(originalNaming, arguments);  },
        isBlock:    function () { return originalNaming.isBlock.apply(originalNaming, arguments);    },
        isElem:     function () { return originalNaming.isElem.apply(originalNaming, arguments);     },
        isBlockMod: function () { return originalNaming.isBlockMod.apply(originalNaming, arguments); },
        isElemMod:  function () { return originalNaming.isElemMod.apply(originalNaming, arguments);  }
    };

if (typeof exports === 'object') {
    module.exports = bemNaming;
    defineAsGlobal = false;
}

if (typeof modules === 'object') {
    modules.define('bem-naming', function (provide) {
        provide(bemNaming);
    });
    defineAsGlobal = false;
}

if (typeof define === 'function') {
    define(function (require, exports, module) {
        module.exports = bemNaming;
    });
    defineAsGlobal = false;
}

defineAsGlobal && (global.bemNaming = bemNaming);

})(this);
