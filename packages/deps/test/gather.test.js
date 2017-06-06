'use strict';

const path = require('path');

const test = require('ava');
const mock = require('mock-fs');

const gather = require('..').gather;

const sep = s => s.split('/').join(path.sep);

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

    return gather(config).then(data =>
        t.deepEqual(data, [
            {
                entity: { block: 'button' },
                tech: 'deps.js',
                path: sep('common.blocks/button/button.deps.js'),
                level: 'common.blocks'
            }
        ])
    );
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
        t.deepEqual(data, [
            {
                entity: { block: 'button' },
                tech: 'deps.js',
                path: sep('common.blocks/button/button.deps.js'),
                level: 'common.blocks'
            },
            {
                entity: { block: 'input' },
                tech: 'deps.js',
                path: sep('common.blocks/input/input.deps.js'),
                level: 'common.blocks'
            },
            {
                entity: { block: 'header' },
                tech: 'deps.js',
                path: sep('desktop.blocks/header/header.deps.js'),
                level: 'desktop.blocks'
            }
        ])
    );
});
