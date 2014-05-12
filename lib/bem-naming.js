function init(separators) {
    separators = separators || {};
    separators.mod = separators.mod || '_';
    separators.elem = separators.elem || '__';

    return separators;
}

function parse(str, separators) {
    var block = str.split(separators.elem)[0];
    var elem = str.split(separators.elem)[1];
    var modKey;
    var modValue;

    if (block) {
        modKey = block.split(separators.mod)[1];
        modValue = block.split(separators.mod)[2];

        block = block.split(separators.mod)[0];
    }

    if (elem) {
        modKey = elem.split(separators.mod)[1];
        modValue = elem.split(separators.mod)[2];

        elem = elem.split(separators.mod)[0];
    }

    if (modKey && modValue === undefined) {
        modValue = true;
    }

    return {
        block: block,
        elem: elem,
        modKey: modKey,
        modValue: modValue
    };
}

function stringify(obj, separators) {
    var buf = [obj.block];

    if (obj.elem) {
        buf.push(separators.elem + obj.elem);
    }

    if (obj.modKey) {
        buf.push(separators.mod + obj.modKey);

        if (obj.modValue) {
            buf.push(separators.mod + obj.modValue);
        }
    }

    return buf.join('');
}

var BEMNotation = function (separators) {
    this._separators = init(separators);
};

BEMNotation.prototype.parse = function (str) {
    return parse(str, this._separators);
};

BEMNotation.prototype.stringify = function (obj) {
    return stringify(obj, this._separators);
};

exports.BEMNotation = BEMNotation;

exports.parse = function (str, separators) {
    separators = init(separators);

    return parse(str, separators);
};

exports.stringify = function (obj, separators) {
    separators = init(separators);

    return stringify(obj, separators);
};
