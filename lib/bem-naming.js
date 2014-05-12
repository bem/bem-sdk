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
        modKey = executed[2] || executed[5],
        modValue = executed[3] || executed[6];

    if (modKey && modValue === undefined) {
        modValue = true;
    }

    return {
        block: executed[1],
        elem: executed[4],
        modKey: modKey,
        modValue: modValue
    };
};

BEMNaming.prototype.stringify = function (obj) {
    var buf = [obj.block];

    if (obj.elem) {
        buf.push(this._separators.elemSeparator + obj.elem);
    }

    if (obj.modKey) {
        buf.push(this._separators.modSeparator + obj.modKey);

        if (obj.modValue) {
            buf.push(this._separators.modSeparator + obj.modValue);
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
}

var defineAsGlobal = true,
    oldSchoolNaming = new BEMNaming({
        modSeparator: MOD_SEPARATOR,
        elemSeparator: ELEM_SEPARATOR,
        literal: LITERAL
    }),
    naming = {
        BEMNaming: BEMNaming,
        parse: oldSchoolNaming.parse.bind(oldSchoolNaming),
        stringify: oldSchoolNaming.stringify.bind(oldSchoolNaming)
    };

if(typeof exports === 'object') {
    module.exports = naming;
    defineAsGlobal = false;
}

if(typeof modules === 'object') {
    modules.define('bem-naming', function(provide) {
        provide(naming);
    });
    defineAsGlobal = false;
}

if(typeof define === 'function') {
    define(function(require, exports, module) {
        module.exports = naming;
    });
    defineAsGlobal = false;
}

defineAsGlobal && (global.naming = naming);

})(this);
