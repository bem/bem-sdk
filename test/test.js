'use strict';

const inspect = require('util').inspect;
const assert = require('assert');
const bemjsonToDecl = require('..');
const BemEntity = require('@bem/entity-name');

let testsNumber = 5;

while (testsNumber) {
    const bemjson = require('./test' + testsNumber + '.bemjson.js');
    const reference = require('./reference' + testsNumber + '.deps.js');
    const result = bemjsonToDecl.convert(bemjson);

    try {
        const errors = reduceErrors(result, reference);
        assert(!errors.length, 'Test #' + testsNumber + ' failed');
    } catch (err) {
        console.log('bemjson', bemjson);

        console.log(err.message);
        console.log('convert\n', result);
        console.log('\nreference\n', inspect(reference, { depth: null }));
        throw new Error(err);
    }

    testsNumber--;
}

function reduceErrors(result, reference) {
    return result.reduce((acc, entity, i) => {
        return acc.concat(entity.isEqual(BemEntity.create(reference[i])) ? [] : [i]);
    }, []);
}
