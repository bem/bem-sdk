(function(global) {

var LITERAL = '[a-zA-Z0-9-]',
    MOD_SEPARATOR = '_',
    ELEM_SEPARATOR = '__';

var BEMNaming = function (options) {
    options || (options = {});

    this._separators = {};
    this._separators.modSeparator = options.modSeparator || MOD_SEPARATOR;
    this._separators.elemSeparator = options.elemSeparator || ELEM_SEPARATOR;
    this._literal = options.literal || LITERAL;

    this._buildRegex();
};

BEMNaming.prototype.parse = function (str) {
    var executed = this._regex.exec(str),
        modName = executed[2] || executed[5],
        modVal = executed[3] || executed[6];

    if (modName && modVal === undefined) {
        modVal = true;
    }

    return {
        block: executed[1],
        elem: executed[4],
        modName: modName,
        modVal: modVal
    };
};

BEMNaming.prototype.stringify = function (obj) {
    var buf = [obj.block];

    if (obj.elem) {
        buf.push(this._separators.elemSeparator + obj.elem);
    }

    if (obj.modName) {
        buf.push(this._separators.modSeparator + obj.modName);

        if (obj.modVal) {
            buf.push(this._separators.modSeparator + obj.modVal);
        }
    }

    return buf.join('');
};

BEMNaming.prototype._buildRegex = function () {
    var word = this._literal + '+',
        block = '(' + word + ')',
        mod = '(?:' + this._separators.modSeparator + '(' + word + '))?',
        elem = '(?:' + this._separators.elemSeparator + '(' + word + '))?';

    this._regex = new RegExp(['^', block, mod, mod, elem, mod, mod, '$'].join(''));
};

var defineAsGlobal = true,
    originalNaming = new BEMNaming({
        modSeparator: MOD_SEPARATOR,
        elemSeparator: ELEM_SEPARATOR,
        literal: LITERAL
    }),
    bemNaming = {
        BEMNaming: BEMNaming,
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
