const assert = require('assert');

const nEval = require('node-eval');

const parseXML = require('./parseXML');

const Key = {
    paramsReg: () => /<i18n:param>(\w+)<\/i18n:param>/g,
    getParams: function (name, value) {
        const r = this.paramsReg();
        const params = [];
        let res = null;

        while ((res = r.exec(value)) !== null) {
            params.push(res[1]);
        }

        return params;
    },
    stringify: (key) => {
        if (typeof key.value === 'object') {
            return Object.keys(key.value).reduce((acc, form) => {
                const k = key.value[form];
                acc.push(`<i18n:${form}>${Key.stringify(k)}</i18n:${form}>`);
                return acc;
            }, [
                '<i18n:dynamic project="tanker" keyset="dynamic" key="plural_adv">',
                '<i18n:count><i18n:param>count</i18n:param></i18n:count>'
            ]).concat(
                '</i18n:dynamic>'
            ).join('');
        }
        if (key.params) {
            return key.value.replace(/{(\w+)}/g, (_, param) => {
                return `<i18n:param>${param}</i18n:param>`;
            });
        }
        return key.value;
    },
    parse: async function(name, value, type) {
        const arr = await parseXML(value);

        const normalize = arr => {
            const { vals, params } = arr.reduce((acc, a) => {
                if (typeof a[0] === 'object') {
                    const plural = Object.keys(a[0]).reduce((acc, form) => {
                        acc[form] = normalize(a[0][form]);
                        return acc;
                    }, {});

                    acc.vals.push(plural);
                } else {
                    acc.vals.push(a[0]);
                }
                a[1] && acc.params.push(a[1]);
                return acc;
            }, { vals: [], params: [] });

            return {
                name,
                value: vals.length === 1 ? vals[0] : vals.join(''),
                params: params.length >= 1 ? params: null
            };
        }

        return normalize(arr);
    }
}

const LangKeys = {
    stringify: langKeys => {
        const keys = langKeys.keys.reduce((acc, key) => {
            acc[key.name] = Key.stringify(key);
            return acc;
        }, {});

        const obj = {
            [langKeys.keysetName || 'unknown']: keys
        };

        const keysStr = JSON.stringify(obj, null, 4);

        const str = `module.exports = ${keysStr};\n`;

        return str;
    },

    parse: str => {
        let data = null;
        let errMsg = '';
        try {
            data = nEval(str);
        } catch(err) {
            const s = err.stack.split('\n');
            errMsg += err.message + '\n';
            errMsg += s[1] + '\n';
            errMsg += s[2] + '\n';
        }

        assert(data, 'Format is not enb or broken\n' + errMsg);

        const keysetNames = Object.keys(data);
        assert(keysetNames.length === 1, 'Must be only one keysetName\n' + str + '\n');

        const keysetName = keysetNames[0];
        const _keys = data[keysetName];
        const keys = Object.keys(_keys).reduce((acc, key) => {
            acc.push([key, _keys[key]]);
            return acc;
        }, []);

        return {
            keysetName,
            keys
        };
    }
}


module.exports = {
    LangKeys,
    Key
}
