(function(global) {

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

    return !obj.modName && !obj.elem;
};

BEMNaming.prototype.isElem = function (obj) {
    obj = this._parse(obj);

    return !obj.modName && !!obj.elem;
};

BEMNaming.prototype.parse = function (str) {
    var executed = this._regex.exec(str),
        modName,
        modVal;

    if (!executed) {
        throw new Error('`' + str + '` is not valid BEM-naming!');
    }

    modName = executed[2] || executed[6];
    modVal = executed[3] || executed[7];

    if (modName && modVal === undefined) {
        modVal = true;
    }

    return {
        block: executed[1] || executed[4],
        elem: executed[5],
        modName: modName,
        modVal: modVal
    };
};

BEMNaming.prototype.stringify = function (obj) {
    var buf = [obj.block];

    if (obj.elem) {
        buf.push(this._elemSeparator + obj.elem);
    }

    if (obj.modName) {
        buf.push(this._modSeparator + obj.modName);

        if (obj.modVal) {
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

    return obj;
};

var defineAsGlobal = true,
    originalNaming = new BEMNaming({
        modSeparator: MOD_SEPARATOR,
        elemSeparator: ELEM_SEPARATOR,
        literal: LITERAL
    }),
    bemNaming = {
        BEMNaming: BEMNaming,
        validate: originalNaming.validate.bind(originalNaming),
        isBlock: originalNaming.isBlock.bind(originalNaming),
        isElem: originalNaming.isElem.bind(originalNaming),
        parse: originalNaming.parse.bind(originalNaming),
        stringify: originalNaming.stringify.bind(originalNaming)
    };

if(typeof exports === 'object') {
    module.exports = bemNaming;
    defineAsGlobal = false;
}

if(typeof modules === 'object') {
    modules.define('bem-naming', function(provide) {
        provide(bemNaming);
    });
    defineAsGlobal = false;
}

if(typeof define === 'function') {
    define(function(require, exports, module) {
        module.exports = bemNaming;
    });
    defineAsGlobal = false;
}

defineAsGlobal && (global.bemNaming = bemNaming);

})(this);
