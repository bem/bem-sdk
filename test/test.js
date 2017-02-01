var inspect = require('util').inspect,
    assert = require('assert'),
    bemjsonToDecl = require('..'),
    BemEntity = require('@bem/entity-name'),
    testsNumber = 5;

while (testsNumber) {
    var bemjson = require('./test' + testsNumber + '.bemjson.js'),
        reference = require('./reference' + testsNumber + '.deps.js'),
        result = bemjsonToDecl.convert(bemjson);

    try {
        var errors = result.reduce((acc, entity, i) => {
            return acc.concat(entity.isEqual(BemEntity.create(reference[i])) ? [] : [i])
        }, []);
        assert(!errors.length, 'Test #' + testsNumber + ' failed');
    } catch(err) {
        console.log('bemjson', bemjson);

        console.log(err.message);
        console.log('convert\n', result);
        console.log('\nreference\n', inspect(reference, { depth: null }));
        throw new Error(err);
    }

    testsNumber--;
}
