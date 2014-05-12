(function(global) {

var LITERAL = '[a-zA-Z0-9-]';
var SEPARATORS = { modSeparator: '_', elemSeparator: '__' };
var REGEX = buildRegex(SEPARATORS, LITERAL);

function buildRegex(separators, literal) {
    var word = literal + '+';
    var block = '(' + word + ')';
    var mod = '(?:' + separators.modSeparator + '(' + word + '))?';
    var elem = '(?:' + separators.elemSeparator + '(' + word + '))?';

    return new RegExp(['^', block, mod, mod, elem, mod, mod, '$'].join(''));
}

function parse(str, regex) {
    var executed = regex.exec(str);
    var modKey = executed[2] || executed[5];
    var modValue = executed[3] || executed[6];

    if (modKey && modValue === undefined) {
        modValue = true;
    }

    return {
        block: executed[1],
        elem: executed[4],
        modKey: modKey,
        modValue: modValue
    };
}

function stringify(obj, separators) {
    var buf = [obj.block];

    if (obj.elem) {
        buf.push(separators.elemSeparator + obj.elem);
    }

    if (obj.modKey) {
        buf.push(separators.modSeparator + obj.modKey);

        if (obj.modValue) {
            buf.push(separators.modSeparator + obj.modValue);
        }
    }

    return buf.join('');
}

var BEMNaming = function (options) {
    options || (options = {});

    this._separators = {};
    this._separators.modSeparator = options.modSeparator || SEPARATORS.modSeparator;
    this._separators.elemSeparator = options.elemSeparator || SEPARATORS.elemSeparator;
    this._literal = options.literal || LITERAL;
    this._regex = buildRegex(this._separators, this._literal);
};

BEMNaming.prototype.parse = function (str) {
    return parse(str, this._regex);
};

BEMNaming.prototype.stringify = function (obj) {
    return stringify(obj, this._separators);
};

var naming = {
    BEMNaming: BEMNaming,

    parse: function (str) {
        return parse(str, REGEX);
    },

    stringify: function (obj) {
        return stringify(obj, SEPARATORS);
    }
};

var defineAsGlobal = true;
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
