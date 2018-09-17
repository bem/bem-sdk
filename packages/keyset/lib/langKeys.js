const assert = require('assert');

const formats = require('./formats');

const { Key, ParamedKey, PluralKey } = require('./key');

class LangKeys {

    constructor(lang, keys, keysetName) {
        this.lang = lang;
        this._keys = new Set(keys || []);
        this.keysetName = keysetName;
    }

    get keys() {
        return [...this._keys];
    }

    stringify(formatName) {
        return LangKeys.stringify(this, formatName);
    }

    static stringify(langKeys, formatName) {
        const format = formats[formatName];

        assert(format, `Unknown format: ${formatName}`);

        return format[LangKeys.name].stringify(langKeys);
    }

    static async parse(str, formatName) {
        const format = formats[formatName];

        assert(format, `Unknown format: ${formatName}`);

        const { lang, keys: keysParsed, keysetName } = await format[LangKeys.name].parse(str);
        const keys = await Promise.all(keysParsed.map(async ([name, value]) => {
            const keyFormat = format[Key.name];

            // TODO: not best return structure of keyFormat.parse
            const { name: n, value: val, params } = await keyFormat.parse(name, value);
            if (typeof val === 'object') {
                const plural = Object.keys(val).reduce((acc, form) => {
                    const { name: n, value: v, params } = val[form];
                    if (params) {
                        acc[form] = new ParamedKey(n, v, params);
                    } else {
                        acc[form] = new Key(n, v);
                    }
                    return acc;
                }, {});

                return new PluralKey(n, plural);
            }
            if (params) {
                return new ParamedKey(n, val, params);
            }
            return new Key(n, val);
        }));

        return new LangKeys(lang, keys, keysetName);
    }

}

module.exports = {
    LangKeys
};
