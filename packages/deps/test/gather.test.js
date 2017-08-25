'use strict';

const test = require('ava');
const mock = require('mock-fs');

const gather = require('..').gather;

test.afterEach(() => {
    mock.restore();
});

test('should gather nothing when no blocks given', t => {
    mock({
        'common.blocks/': {}
    });

    const config = {
        levels: ['common.blocks']
    };

    return gather(config).then(data =>
        t.deepEqual(data, [])
    );
});

test('should gather from one level given', t => {
    mock({
        'common.blocks/button/button.deps.js': ''
    });

    const config = {
        levels: ['common.blocks']
    };

    return gather(config).then(data => {
        t.deepEqual(data.map(f => f.cell.id), [
            'button@common.blocks.deps.js'
        ])
    });
});

test('should gather entities', t => {
    mock({
        'common.blocks/button/button.deps.js': '',
        'common.blocks/input/input.deps.js': '',
        'desktop.blocks/header/header.deps.js': ''
    });

    const config = {
        levels: ['common.blocks', 'desktop.blocks']
    };

    return gather(config).then(data =>
        t.deepEqual(data.map(f => f.cell.id), [
            'button@common.blocks.deps.js',
            'input@common.blocks.deps.js',
            'header@desktop.blocks.deps.js'
        ])
    );
});
