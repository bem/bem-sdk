const assert = require('assert');

const nEval = require('node-eval');

const LangKeys = {
    stringify: langKeys => {
        let lastKey = langKeys.keys[langKeys.keys.length - 1];
        const keys = langKeys.keys.reduce((acc, key) => {
            acc[key.name] = key.value;
            return acc;
        }, {});
        const replacer = (k, v) => {
            if (typeof v === 'string') {
                return v.replace(/"/g, '__*') + ',,';
            }
            return v;
        };
        const keysStr = JSON.stringify(keys, replacer, 4)
             // change all quotes to single
            .replace(/"/g, '\'')
             // but keep double quotes inside keys
            .replace(/__\*/g, '"')
             // add trailing commas
            .replace(/,,'/g, '\',')
            .replace(/,,/g, ',')
            .replace(/}\n/g, '},\n')

        const str = `export const ${langKeys.lang} = ${keysStr};`;

        return str;
    },

    parse: async str => {
        const strToParse = str.replace('export const ', 'module.exports.')

        let data = null; 
        try {
            data = nEval(strToParse);
        } catch(err) {}

        assert(data, 'Format is not taburet or broken\n' + str + '\n');

        const langs = Object.keys(data);
        assert(langs.length === 1, 'Must be only one lang\n' + str + '\n');

        const lang = langs[0];
        const _keys = data[lang];
        const keys = Object.keys(_keys).reduce((acc, key) => {
            acc.push([key, _keys[key]]);
            return acc;
        }, []);

        return {
            lang,
            keys
        };
    }
}

const Key = {
    paramsReg: () => /{(\w+)}/g,
    getParams: function (name) {
        const r = this.paramsReg();
        const params = [];
        let res = null;

        while ((res = r.exec(name)) !== null) {
            params.push(res[1]);
        }

        return params;
    },
    getType: function(name, value) {
        if (typeof value === 'object') {
            return 'plural';
        } else if (typeof value === 'string') {
            if (this.paramsReg().test(name)) {
                return 'paramed';
            } else {
                return 'simple';
            }
        } else {
            return 'broken';
        }
    }
}

module.exports = {
    LangKeys,
    Key
}
