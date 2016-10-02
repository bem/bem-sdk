const test = require('ava');

const stringify = require('../../lib/stringify');

test('should throws error if no format given', t => {
    t.throws(() => stringify({ entity: { block: 'block' }, tech: null }), 'You must declare target format');
});

test('should stringify enb declaration', t => {
    const obj = [{ block: 'block', elem: 'elem', mod: 'mod', val: 'val' }];
    t.deepEqual(
        stringify(
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null },
            { format: 'enb' }
        ),
        'exports.deps = ' + JSON.stringify(obj, null, 4) + ';\n'
    );
});
