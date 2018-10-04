'use strict';

const assert = require('assert');
const util = require('util');

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
}

// TODO: maybe we don't need to keep params in our structure ?
// https://github.com/bem/bem-sdk/issues/348
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
