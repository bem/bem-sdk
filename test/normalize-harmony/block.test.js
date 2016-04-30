var test = require('ava'),
    normalize = require('../../lib/normalize-harmony');

test('should support block', function (t) {
    var block = { block: 'block' };

    t.deepEqual(normalize(block), [block]);
});

test('should support block as string', function (t) {
    t.deepEqual(normalize(['block']), [{ block: 'block' }]);
});
