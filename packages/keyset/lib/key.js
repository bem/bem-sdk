const assert = require('assert');
const util = require('util');

const formats = require('./formats');

class Key {
    constructor(name, value) {
        assert(typeof name === 'string', 'Key name should be string');

        this.name = name;
        this.value = value;
    }

    toString() {
        return this.value;
    }

    valueOf() {
        return this.value;
    }

    inspect(depth, options) {
        const stringRepresentation = util.inspect(this.valueOf(), options);

        return `${this.constructor.name} { name: '${this.name}', value: ${stringRepresentation} }`;
    }

    toJSON() {
        return this.valueOf();
    }


    // static async createKeys(rawKeys, syntax) {
    //     const errors = [];
    //     const keys = new Set();
    //     if (syntax === AVAILABLE_SYNTAXES.SERP) {
    //         for (let [name, value] of Object.entries(rawKeys)) {
    //             let keyValue = '';
    //             let keyName = name;
    //             let key = null;

    //             if (!value.includes('<i18n:')) {
    //                 try {
    //                     keyValue = await transform(value);
    //                 } catch (err) {
    //                     errors.push(err);
    //                     continue;
    //                 }

    //                 // TODO refactor
    //                 // TODO: extract params
    //                 if (typeof keyValue === 'string') {
    //                     key = new ParamedKey(keyName, keyValue);
    //                 } else if (typeof keyValue === 'object') {
    //                     key = new PluralKey(keyName, keyValue);
    //                 } else {
    //                     key = new Key(keyName, keyValue);
    //                 }
    //             } else {
    //                 key = new Key(keyName, keyValue);
    //             }

    //             if (key) {
    //                 keys.add(key);
    //             }
    //         }
    //     }

    //     return [keys, errors];
    // }
}

class ParamedKey extends Key {
    constructor(name, value, params=[]) {
        super(name, value);

        const errors = [];
        params.forEach(param => {
            value.includes(param) || errors.push(`Key: value should include param: ${param}`);
        });

        assert(errors.length === 0, errors.join('\n'));
        this.params = params;
    }
}

class PluralKey extends Key {
    constructor(name, value) {
        super(name, value);

        this.forms = value;
    }
}

module.exports = {
    Key,
    ParamedKey,
    PluralKey
};
